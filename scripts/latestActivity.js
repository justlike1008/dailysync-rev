// scripts/latestActivity.js
// 功能：获取 Garmin CN 最近一条运动 ID，并输出到 latest.txt

import fs from "fs";
import path from "path";
import GarminConnect from "garmin-connect"; // 社区版 Node.js 客户端

async function main() {
  try {
    // 从环境变量读取账号密码
    const username = process.env.GARMIN_USERNAME;
    const password = process.env.GARMIN_PASSWORD;

    if (!username || !password) {
      throw new Error("请设置 GARMIN_USERNAME 和 GARMIN_PASSWORD 环境变量");
    }

    // 初始化客户端
    const client = new GarminConnect({ username, password });
    await client.login(); // 登录 Garmin
    console.log("Garmin login success");

    // 获取最近一条活动，limit=1
    const activities = await client.getActivities(0, 1);

    if (!activities || activities.length === 0) {
      console.log("No activities found");
      process.exit(0);
    }

    const latest = activities[0];
    const latestId = latest.activityId;

    // 写入 latest.txt 文件
    const filePath = path.join(__dirname, "..", "latest.txt");
    fs.writeFileSync(filePath, latestId.toString());

    console.log(`Latest activity ID: ${latestId}`);
  } catch (err) {
    console.error("Error fetching latest activity:", err.message);
    process.exit(1);
  }
}

main();
