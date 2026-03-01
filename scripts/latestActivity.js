// scripts/latestActivity.js
// 功能：获取 Garmin CN 最近一条运动 ID，带 session 缓存，减少频繁登录

const fs = require("fs");
const path = require("path");
const GarminConnect = require("garmin-connect");

const SESSION_FILE = path.join(__dirname, "..", ".garmin_session.json");

async function main() {
  try {
    const username = process.env.GARMIN_USERNAME;
    const password = process.env.GARMIN_PASSWORD;

    if (!username || !password) throw new Error("请设置 GARMIN_USERNAME 和 GARMIN_PASSWORD");

    const client = new GarminConnect({ username, password });

    // 尝试加载已有 session
    if (fs.existsSync(SESSION_FILE)) {
      const sessionData = JSON.parse(fs.readFileSync(SESSION_FILE, "utf-8"));
      client.setCookies(sessionData.cookies);
      console.log("Loaded Garmin session from cache");
    }

    // 登录，如果 session 失效会重新登录
    await client.login();
    console.log("Garmin CN login success");

    // 保存 session
    fs.writeFileSync(SESSION_FILE, JSON.stringify({ cookies: client.cookies }));
    console.log("Garmin session cached");

    // 获取最近一条活动
    const activities = await client.getActivities(0, 1);
    if (!activities || activities.length === 0) process.exit(0);

    const latestId = activities[0].activityId;

    // 写入 latest.txt
    const filePath = path.join(process.cwd(), "latest.txt");
    fs.writeFileSync(filePath, latestId.toString());
    console.log(`Latest activity ID: ${latestId}`);
  } catch (err) {
    console.error("Error fetching latest activity:", err.message);
    process.exit(1);
  }
}

main();
