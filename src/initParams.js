import fs from "fs";

const defaultParams = `export default ${JSON.stringify(
  {
    categories: [
      "performance",
      "accessibility",
      "best-practices",
      "seo",
      "pwa",
    ],
    output: {
      format: "json",
      urlFormat: "href",
    },
    urls: [
      "https://www.google.com",
      "https://www.bing.com",
      "https://www.yahoo.com",
    ],
    runCount: 5,
    audits: [
      "first-contentful-paint",
      "largest-contentful-paint",
      "speed-index",
      "total-blocking-time",
      "cumulative-layout-shift",
      "interactive",
    ],
    device: "mobile",
    headless: true,
  },
  null,
  2
)}`;

const main = async () => {
  if (fs.existsSync("params.js")) {
    console.log("🤖 params.js already exists");
    return;
  }
  try {
    await fs.writeFileSync("params.js", defaultParams);
  } catch (err) {
    throw err;
  }
};

main();
