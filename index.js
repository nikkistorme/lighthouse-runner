import params from "./params.js";
import runReport2 from "./src/runReport2.js";
import processReport2 from "./src/processReport2.js";

if (!params.urls?.length > 0) throw `🙅 No URLs found in params.js`;
if (typeof params.runCount !== "number" || params.runCount <= 0)
  throw `🙅 runCount must be a number greater than 0`;

const main = async () => {
  try {
    const results = await runReport2();
    await processReport2(results);
  } catch (err) {
    console.error(err);
  }
};

main();
