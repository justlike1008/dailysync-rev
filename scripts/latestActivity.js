// scripts/latestActivity.js
// 功能：获取 Garmin CN 最近一条运动 ID，输出到 latest.txt
// 注意：此版本使用环境变量 GARMIN_USERNAME 和 GARMIN_PASSWORD 登录

const fs = require('fs');
const path = require('path');
const axios = require('axios'); // 需要在项目里安装 axios

// 从环境变量读取账号信息
const username = process.env.GARMIN_USERNAME;
const password = process.env.GARMIN_PASSWORD;

if (!username || !password) {
  console.error("请设置 GARMIN_USERNAME 和 GARMIN_PASSWORD 环境变量");
  process.exit(1);
}

// 这里用一个简化的方式模拟登录 Garmin
// 正式项目中可以用 garmin-connect 包登录获取最新活动
async function fetchLatestActivityId() {
  try {
    // TODO: 替换成真实 Garmin API 调用
    // 这里暂时返回时间戳模拟最新活动
    const latestActivityId = Date.now();

    const filePath = path.join(__dirname, '..', 'latest.txt');
    fs.writeFileSync(filePath, latestActivityId.toString());
    console.log(`Latest activity ID: ${latestActivityId}`);
  } catch (err) {
    console.error("获取最新活动失败:", err);
    process.exit(1);
  }
}

fetchLatestActivityId();
