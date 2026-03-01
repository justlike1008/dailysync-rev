const fs = require("fs");
const path = require("path");
const GarminConnect = require("@gooin/garmin-connect").default;

const SESSION_FILE = path.join(__dirname, "..", ".garmin_session.json");
const LAST_FILE = path.join(__dirname, "..", ".last_activity");
const LATEST_FILE = path.join(process.cwd(), "latest.txt");

async function main() {
  try {
    const username = process.env.GARMIN_USERNAME;
    const password = process.env.GARMIN_PASSWORD;

    if (!username || !password) throw new Error("请设置 GARMIN_USERNAME 和 GARMIN_PASSWORD");

    const client = new GarminConnect({ username, password });

    if (fs.existsSync(SESSION_FILE)) {
      const sessionData = JSON.parse(fs.readFileSync(SESSION_FILE, "utf-8"));
      client.setCookies(sessionData.cookies);
      console.log("Loaded Garmin session from cache");
    }

    await client.login();
    console.log("Garmin login success");

    fs.writeFileSync(SESSION_FILE, JSON.stringify({ cookies: client.cookies }));
    console.log("Garmin session cached");

    const activities = await client.getActivities(0, 1);
    if (!activities || activities.length === 0) process.exit(0);

    const latestId = activities[0].activityId;
    fs.writeFileSync(LATEST_FILE, latestId.toString());
    console.log(`Latest activity ID: ${latestId}`);

    // 首次运行自动生成 .last_activity 文件
    if (!fs.existsSync(LAST_FILE)) {
      fs.writeFileSync(LAST_FILE, latestId.toString());
      console.log(".last_activity 文件首次生成完成");
    }

  } catch (err) {
    console.error("Error fetching latest activity:", err.message);
    process.exit(1);
  }
}

main();
