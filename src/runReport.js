import lighthouse from "lighthouse";
import chromeLauncher from "chrome-launcher";
import fs from "fs";
import desktopConfig from "lighthouse/lighthouse-core/config/desktop-config.js";

import params from "../params.js";

const dateTimeString = () => {
  const now = new Date();
  const date = now.toJSON().slice(0, 10);
  const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  return `${date}_${time}`;
};

const makeReportDir = () => {
  const reportName = `reports/${dateTimeString()}`;
  if (!fs.existsSync("reports")) fs.mkdirSync("reports");
  if (!fs.existsSync(reportName)) fs.mkdirSync(reportName);
  return reportName;
};

const getTargetDir = (reportDir, url) => {
  const urlObj = new URL(url);
  let dirName = `${reportDir}/${urlObj.host.replace("www.", "")}`;
  if (urlObj.pathname !== "/")
    dirName = `${dirName}${urlObj.pathname.replace(/\//g, "_")}`; //replace slashes with underscores
  if (!fs.existsSync(dirName)) fs.mkdirSync(dirName);
  return dirName;
};

const getFileName = () => {
  return `${dateTimeString()}.json`;
};

const launchChromeAndRunLighthouse = async (chrome, url, reportDir) => {
  console.log(`🤖 Beginning audit for ${url}...`);
  try {
    const options = {
      logLevel: "info",
      extends: "lighthouse:default",
      port: chrome.port,
      output: "json",
      onlyCategories: params.categories,
      onlyAudits: params.audits,
    };
    let results;
    switch (params.device) {
      case "desktop":
        results = await lighthouse(url, options, desktopConfig);
        allDesktopResults.push(results);
        break;
      case "mobile":
        results = await lighthouse(url, options);
        allMobileResults.push(results);
        break;
      case "both":
        const mobileResults = await lighthouse(url, options);
        const desktopResults = await lighthouse(url, options, desktopConfig);
        allMobileResults.push(mobileResults);
        allDesktopResults.push(desktopResults);
      default:
        results = await lighthouse(url, options);
        allMobileResults.push(results);
        break;
    }
    const dirName = getTargetDir(reportDir, url);
    const fileName = getFileName();
    await fs.writeFileSync(`${dirName}/${fileName}`, results.report);
    console.log(`🤖 Finished audit for ${url}`);
  } catch (err) {
    console.log(`🤖 Error found for ${url}...`);
    throw err;
  }
};

const killChrome = async (chrome) => {
  console.log("🤖 Closing Chrome...");
  await chrome.kill();
};

const runReport = async () => {
  const reportDir = makeReportDir();
  console.log(`🤖 Start report ${reportDir}`);
  console.log("🤖 Launching Chrome...");
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
  // const chrome = await chromeLauncher.launch();
  try {
    for (const url of params.urls) {
      if (!url) continue;
      let count = 0;
      while (count < params.runCount) {
        await launchChromeAndRunLighthouse(chrome, url, reportDir);
        count++;
      }
    }
    await killChrome(chrome);
    console.log(`🤖 Finished report ${reportDir}`);
    return reportDir;
  } catch (err) {
    killChrome(chrome);
    throw err;
  }
};

export default runReport;
