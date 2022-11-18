import lighthouse from "lighthouse";
import chromeLauncher from "chrome-launcher";
import desktopConfig from "lighthouse/lighthouse-core/config/desktop-config.js";

import params from "../params.js";

const killChrome = async (chrome) => {
  console.log("🤖 Closing Chrome...");
  await chrome.kill();
};

const runLighthouse = async (url, chrome, device) => {
  try {
    const options = {
      // logLevel: "info",
      extends: "lighthouse:default",
      port: chrome.port,
      output: "json",
      onlyCategories: params.categories,
      onlyAudits: params.audits,
    };
    let results;
    switch (device) {
      case "desktop":
        results = await lighthouse(url, options, desktopConfig);
        break;
      default:
        results = await lighthouse(url, options);
        break;
    }
    return results.lhr;
  } catch (err) {
    console.log(`🤖 Error found for ${url}...`);
    throw err;
  }
};

const runReport2 = async () => {
  console.log("🤖 Launching Chrome...");
  const device = params.device;
  const results = {
    desktop: [],
    mobile: [],
  };
  let chrome;
  if (params.headless)
    chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
  else chrome = await chromeLauncher.launch();
  try {
    for (const url of params.urls) {
      if (!url) continue;
      let count = 0;
      while (count < params.runCount) {
        if (device === "desktop") {
          console.log(`🤖 Beginning desktop audit ${count + 1} for ${url}...`);
          const desktopResult = await runLighthouse(url, chrome, "desktop");
          console.log(`🤖 Finished desktop audit ${count + 1} for ${url}`);
          results.desktop.push(desktopResult);
        } else if (device === "both") {
          console.log(`🤖 Beginning mobile audit ${count + 1} for ${url}...`);
          const mobileResult = await runLighthouse(url, chrome, "mobile");
          console.log(`🤖 Finished mobile audit ${count + 1} for ${url}`);
          console.log(`🤖 Beginning desktop audit ${count + 1} for ${url}...`);
          const desktopResult = await runLighthouse(url, chrome, "desktop");
          console.log(`🤖 Finished desktop audit ${count + 1} for ${url}`);
          results.mobile.push(mobileResult);
          results.desktop.push(desktopResult);
        } else {
          console.log(`🤖 Beginning mobile audit ${count + 1} for ${url}...`);
          const mobileResult = await runLighthouse(url, chrome, "mobile");
          console.log(`🤖 Finished mobile audit ${count + 1} for ${url}`);
          results.mobile.push(mobileResult);
        }
        count++;
      }
    }
    await killChrome(chrome);
    return results;
  } catch (err) {
    killChrome(chrome);
    throw err;
  }
};

export default runReport2;
