// scripts/latestActivity.js
// 功能：获取 Garmin CN 最近一条运动 ID，输出数字到 latest.txt
// 注意：使用环境变量 GARMIN_USERNAME 和 GARMIN_PASSWORD 登录

import fs from "fs";
import path from "path";
import GarminConnect from "garmin-connect"; // npm install garmin-connect

async function main() {
  try {
    const username = process.env.GARMIN_USERNAME;
    const password = process.env.GARMIN_PASSWORD;

    if (!username || !password) {
      throw new Error("请设置 GARMIN_USERNAME 和 GARMIN_PASSWORD 环境变量");
    }

    // 初始化 Garmin 客户端
    const client = new GarminConnect({ username, password });
    await client.login();
    console.log("Garmin CN login success");

    // 获取最近一条活动，limit=1
    const activities = await client.getActivities(0, 1);

    if (!activities || activities.length === 0) {
      console.log("No activities found");
      process.exit(0);
    }

    const latest = activities[0];
    const latestId = latest.activityId; // 数字 ID

    // 写入 latest.txt
    const filePath = path.join(__dirname, "..", "latest.txt");
    fs.writeFileSync(filePath, latestId.toString());

    console.log(`Latest activity ID: ${latestId}`);
  } catch (err) {
    console.error("Error fetching latest activity:", err.message);
    process.exit(1);
  }
}

main();
