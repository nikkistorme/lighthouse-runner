import fs from "fs";
import papa from "papaparse";

import params from "../params.js";

const auditsInSeconds = [
  "first-contentful-paint",
  "speed-index",
  "largest-contentful-paint",
  "interactive",
  "first-meaningful-paint",
  "mainthread-work-breakdown",
  "bootup-time",
];

const createCsv = (fields, data, name) => {
  const csv = papa.unparse({
    fields: fields,
    data: data,
  });
  fs.writeFileSync(`${name}.csv`, csv, "utf8");
};

const getAverageScore = (audits, auditType) => {
  const auditList = audits[auditType];
  const scoreList = [];
  let numericUnit = "";
  auditList.forEach((audit) => {
    scoreList.push(audit.numericValue);
    if (!numericUnit) numericUnit = audit.numericUnit;
  });
  const scoreAvg = scoreList.reduce((a, b) => a + b) / scoreList.length;
  let rounded;
  if (auditsInSeconds.includes(auditType)) {
    const scoreAvgSecs = scoreAvg / 1000;
    rounded = Math.round(scoreAvgSecs * 10) / 10;
  } else {
    rounded = Math.round(scoreAvg);
  }
  return rounded;
};

const getReportUrls = (reportName) => {
  const reportUrls = fs
    .readdirSync(reportName, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  return reportUrls;
};

const getRunsforUrl = (filePath) => {
  const runs = fs
    .readdirSync(filePath, {
      withFileTypes: true,
    })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => `${filePath}/${dirent.name}`);
  return runs;
};

const getRunAuditsJSON = (runFilePath) => {
  let auditData = {};
  const runData = JSON.parse(fs.readFileSync(runFilePath));
  Object.keys(runData.audits).forEach((audit) => {
    if (!auditData[audit]) {
      auditData[audit] = [runData.audits[audit]];
    } else {
      auditData[audit].push(runData.audits[audit]);
    }
  });
  return auditData;
};

const getReleventAuditsFromRuns = (runs) => {
  let auditsByType = {};
  runs.forEach((run) => {
    const runAudits = getRunAuditsJSON(run);
    Object.keys(runAudits).forEach((runAudit) => {
      if (Object.keys(auditsByType).includes(runAudit)) {
        auditsByType[runAudit] = auditsByType[runAudit].concat(
          runAudits[runAudit]
        );
      } else {
        auditsByType[runAudit] = runAudits[runAudit];
      }
    });
  });
  Object.keys(auditsByType).forEach((auditType) => {
    const auditIsRelevant = params.audits.includes(auditType);
    if (!auditIsRelevant) delete auditsByType[auditType];
  });
  return auditsByType;
};

const getFormattedUrl = (runData) => {
  const url = new URL(runData.requestedUrl);
  const format = url[params.output.urlFormat];
  if (!format) return url.href;
  return format;
};

const getAvgScoreInfoForCategory = (category, runFilePaths) => {
  let url;
  let scoreTitle;
  // Make list of all scores for category
  const scores = [];
  runFilePaths.forEach((runFilePath, index) => {
    const runData = JSON.parse(fs.readFileSync(runFilePath));
    scores.push(runData.categories[category].score);
    if (index === 0) scoreTitle = `${runData.categories[category].title} Score`;
    // Get URL formatted as specified in params.json
    url = getFormattedUrl(runData);
  });
  // Get average score
  let avgScore = 0;
  avgScore = scores.reduce((a, b) => a + b) / scores.length;
  avgScore = Math.round(avgScore * 100);
  return { url, title: scoreTitle, avgScore };
};

const processReport = async (reportName) => {
  console.log(`🤖 Processing report ${reportName}...`);
  let reportObj = {};
  let scores = {};
  let csvFields = ["URL"];
  let dataArr = [];
  getReportUrls(reportName).forEach((reportUrl) => {
    reportObj[reportUrl] = {};
    const reportUrlDirPath = `${reportName}/${reportUrl}`;
    const runs = getRunsforUrl(reportUrlDirPath);
    reportObj[reportUrl] = getReleventAuditsFromRuns(runs);
    // Get average scores for each Lighthouse category requested in params.json
    params.categories.forEach((category) => {
      if (!scores[reportUrl]) scores[reportUrl] = {};
      scores[reportUrl][category] = getAvgScoreInfoForCategory(category, runs);
      // Add category title to CSV fields
      if (!csvFields.includes(scores[reportUrl][category].title))
        csvFields.push(scores[reportUrl][category].title);
    });
  });

  Object.keys(reportObj).forEach((reportUrl) => {
    const formattedUrl = scores[reportUrl][params.categories[0]].url;
    const csvRow = [formattedUrl];
    Object.keys(scores[reportUrl]).forEach((category) => {
      csvRow.push(scores[reportUrl][category].avgScore);
    });
    const auditTypes = reportObj[reportUrl];
    Object.keys(auditTypes).forEach((auditList) => {
      csvRow.push(getAverageScore(auditTypes, auditList));
      if (!csvFields.includes(auditTypes[auditList][0].title))
        csvFields.push(auditTypes[auditList][0].title);
    });
    dataArr.push(csvRow);
  });

  createCsv(csvFields, dataArr, reportName);
  console.log(`🤖 Finished report`);
};

export default processReport;
