const fs = require("fs");
const path = require("path");
const GarminConnect = require("garmin-connect");

const SESSION_FILE = path.join(__dirname, "..", ".garmin_session.json");

async function main() {
  try {
    const username = process.env.GARMIN_USERNAME;
    const password = process.env.GARMIN_PASSWORD;

    if (!username || !password) throw new Error("请设置 GARMIN_USERNAME 和 GARMIN_PASSWORD");

    // ⚠️ 直接调用函数，不用 new
    const client = GarminConnect({ username, password });

    // 尝试加载 session
    if (fs.existsSync(SESSION_FILE)) {
      const sessionData = JSON.parse(fs.readFileSync(SESSION_FILE, "utf-8"));
      client.setCookies(sessionData.cookies);
      console.log("Loaded Garmin session from cache");
    }

    await client.login();
    console.log("Garmin CN login success");

    fs.writeFileSync(SESSION_FILE, JSON.stringify({ cookies: client.cookies }));
    console.log("Garmin session cached");

    const activities = await client.getActivities(0, 1);
    if (!activities || activities.length === 0) process.exit(0);

    const latestId = activities[0].activityId;

    const filePath = path.join(process.cwd(), "latest.txt");
    fs.writeFileSync(filePath, latestId.toString());
    console.log(`Latest activity ID: ${latestId}`);
  } catch (err) {
    console.error("Error fetching latest activity:", err.message);
    process.exit(1);
  }
}

main();
