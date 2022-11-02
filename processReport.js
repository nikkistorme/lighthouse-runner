import fs from "fs";
import papa from "papaparse";

import params from "./params.js";

const auditsInSeconds = [
  "first-contentful-paint",
  "speed-index",
  "largest-contentful-paint",
  "interactive",
];

const auditsInMilliseconds = ["total-blocking-time"];

const getAverageScore = (audits, auditType) => {
  const auditList = audits[auditType];
  const scoreList = auditList.map((audit) => audit.numericValue);
  const scoreAvg = scoreList.reduce((a, b) => a + b) / scoreList.length;
  let rounded;
  if (auditsInSeconds.includes(auditType)) {
    const scoreAvgSecs = scoreAvg / 1000;
    rounded = Math.round(scoreAvgSecs * 10) / 10;
  } else if (auditsInMilliseconds.includes(auditType)) {
    rounded = Math.round(scoreAvg);
  } else {
    rounded = Math.round(scoreAvg * 1000) / 1000;
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

const getRunAuditsJSON = (run) => {
  let auditData = {};
  let runData = fs.readFileSync(run);
  runData = JSON.parse(fs.readFileSync(run));
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
  const auditOutput = params.auditOutput;
  let auditsByType = {};
  runs.forEach((run) => {
    if (auditOutput === "csv") {
      runData = fs.readFileSync(run).toString().split("\n");
    } else if (auditOutput === "json") {
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
    }
  });
  Object.keys(auditsByType).forEach((auditType) => {
    const auditIsRelevant = params.audits.includes(auditType);
    if (!auditIsRelevant) delete auditsByType[auditType];
  });
  return auditsByType;
};

const getAvgPerfScore = (runs) => {
  let avg = 0;
  if (params.auditOutput === "json") {
    const scores = runs.map((run) => {
      const runData = JSON.parse(fs.readFileSync(run));
      return runData.categories.performance.score;
    });
    avg = scores.reduce((a, b) => a + b) / scores.length;
    avg = Math.round(avg * 100);
  }
  return avg;
};

const processReport = async (reportName) => {
  console.log(`🤖 Processing report ${reportName}...`);
  let reportObj = {};
  let scores = {};
  getReportUrls(reportName).forEach((reportUrl) => {
    reportObj[reportUrl] = {};
    const reportUrlDirPath = `${reportName}/${reportUrl}`;
    const runs = getRunsforUrl(reportUrlDirPath);
    reportObj[reportUrl] = getReleventAuditsFromRuns(runs);
    scores[reportUrl] = getAvgPerfScore(runs);
  });

  let dataArr = [];
  Object.keys(reportObj).forEach((reportUrl) => {
    dataArr.push([
      reportUrl,
      scores[reportUrl],
      getAverageScore(reportObj[reportUrl], "first-contentful-paint"),
      getAverageScore(reportObj[reportUrl], "speed-index"),
      getAverageScore(reportObj[reportUrl], "largest-contentful-paint"),
      getAverageScore(reportObj[reportUrl], "interactive"),
      getAverageScore(reportObj[reportUrl], "total-blocking-time"),
      getAverageScore(reportObj[reportUrl], "cumulative-layout-shift"),
    ]);
  });

  const csvFields = [
    "URL",
    "Score",
    "FCP (s)",
    "SI (s)",
    "LCP (s)",
    "TTI (s)",
    "TBT (ms)",
    "CLS",
  ];
  const csv = papa.unparse({
    fields: csvFields,
    data: dataArr,
  });
  fs.writeFileSync(`${reportName}.csv`, csv, "utf8");
  console.log(`🤖 Finished report`);
};

export default processReport;
