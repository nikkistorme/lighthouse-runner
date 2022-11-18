import fs from "fs";
import papa from "papaparse";

import categoryInfo from "./categoryInfo.js";
import auditInfo from "./auditInfo.js";

import params from "../params.js";

const createCsv = (fields, data, name) => {
  const csv = papa.unparse({
    fields: fields,
    data: data,
  });
  fs.writeFileSync(`${name}.csv`, csv, "utf8");
};

const avgCategoryScore = (results, category) => {
  const scores = results.map((r) => r.categories[category].score);
  const sum = scores.reduce((a, b) => a + b, 0);
  const count = scores.length;
  const avg = sum / count;
  return Math.round(avg * 100);
};

const avgAuditScore = (results, audit) => {
  const unit = auditInfo[audit].unit;
  let scores;
  scores = results.map((r) => r.audits[audit].numericValue);
  const sum = scores.reduce((a, b) => a + b, 0);
  const count = scores.length;
  const avg = sum / count;
  if (unit === "s") return (avg / 1000).toFixed(1);
  if (["cumulative-layout-shift"].includes(audit)) return avg.toFixed(3);
  return Math.round(avg);
};

const processReport2 = async (results) => {
  console.log(`🤖 Processing report ...`);
  const urls = params.urls;
  const csvFields = ["URL", "Device"];
  const dataArr = [];

  urls.forEach((url) => {
    console.log("🚀 ~ url", url);
    const mobileDataRow = [url, "Mobile"];
    const desktopDataRow = [url, "Desktop"];
    const mobileResults = [];
    const desktopResults = [];
    switch (params.device) {
      case "desktop":
        results.desktop.forEach((r) => {
          if (r.requestedUrl === url) desktopResults.push(r);
        });
        break;
      case "both":
        results.mobile.forEach((r) => {
          if (r.requestedUrl === url) mobileResults.push(r);
        });
        results.desktop.forEach((r) => {
          if (r.requestedUrl === url) desktopResults.push(r);
        });
        break;
      default:
        results.mobile.forEach((r) => {
          if (r.requestedUrl === url) mobileResults.push(r);
        });
    }
    params.categories.forEach((category) => {
      const title = categoryInfo[category].title;
      if (!csvFields.includes(title)) csvFields.push(title);
      if (mobileResults.length > 0)
        mobileDataRow.push(avgCategoryScore(mobileResults, category));
      if (desktopResults.length > 0)
        desktopDataRow.push(avgCategoryScore(desktopResults, category));
    });
    params.audits.forEach((audit) => {
      const title = `${auditInfo[audit].title} (${auditInfo[audit].unit})`;
      if (!csvFields.includes(title)) csvFields.push(title);
      if (mobileResults.length > 0)
        mobileDataRow.push(avgAuditScore(mobileResults, audit));
      if (desktopResults.length > 0)
        desktopDataRow.push(avgAuditScore(desktopResults, audit));
      // if (audit === "modern-image-formats")
    });
    dataArr.push(mobileDataRow);
    dataArr.push(desktopDataRow);
  });

  createCsv(csvFields, dataArr, "report");
  fs.writeFileSync("results.json", JSON.stringify(results, null, 2));
  console.log(`🤖 Finished report`);
};

export default processReport2;
