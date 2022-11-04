import params from "./params.js";
import runReport from "./src/runReport.js";
import processReport from "./src/processReport.js";

if (!params.urls?.length > 0) throw `🙅 No URLs found in params.js`;
if (typeof params.runCount !== "number" || params.runCount <= 0)
  throw `🙅 runCount must be a number greater than 0`;

const main = async () => {
  try {
    const reportName = await runReport();
    await processReport(reportName);
  } catch (err) {
    console.error(err);
  }
};

main();
