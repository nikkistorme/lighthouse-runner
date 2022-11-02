export default {
  categories: ["performance"],
  auditOutput: "json",
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
};
