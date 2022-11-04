# Lighthouse Runner

## Getting Started

Once you have the code, follow these steps to get started:

1. Install the dependencies: `npm install`
2. Create a parameter file: `npm run init-params`
3. Edit the parameter file to set the parameters for your report. Parameters include [URLs](#urls), [categories](#categories), [audits](#audits), [output](#output), and [run count](#run-count).
4. Run the report: `npm run report`

## Parameters

### URLs

### Categories

The categories parameter is an array of strings that specify which categories to run. The default is to run all categories. The available categories are:

- "performance",
- "accessibility",
- "best-practices",
- "seo",
- "pwa",

### Audits

- "viewport",
- "first-contentful-paint",
- "largest-contentful-paint",
- "first-meaningful-paint",
- "speed-index",
- "screenshot-thumbnails",
- "final-screenshot",
- "total-blocking-time",
- "max-potential-fid",
- "cumulative-layout-shift",
- "server-response-time",
- "interactive",
- "user-timings",
- "critical-request-chains",
- "redirects",
- "mainthread-work-breakdown",
- "bootup-time",
- "uses-rel-preload",
- "uses-rel-preconnect",
- "font-display",
- "diagnostics",
- "network-requests",
- "network-rtt",
- "network-server-latency",
- "main-thread-tasks",
- "metrics",
- "performance-budget",
- "timing-budget",
- "resource-summary",
- "third-party-summary",
- "third-party-facades",
- "largest-contentful-paint-element",
- "lcp-lazy-loaded",
- "layout-shift-elements",
- "long-tasks",
- "no-unload-listeners",
- "non-composited-animations",
- "unsized-images",
- "preload-lcp-image",
- "full-page-screenshot",
- "script-treemap-data",
- "uses-long-cache-ttl",
- "total-byte-weight",
- "offscreen-images",
- "render-blocking-resources",
- "unminified-css",
- "unminified-javascript",
- "unused-css-rules",
- "unused-javascript",
- "modern-image-formats",
- "uses-optimized-images",
- "uses-text-compression",
- "uses-responsive-images",
- "efficient-animated-content",
- "duplicated-javascript",
- "legacy-javascript",
- "dom-size",
- "no-document-write",
- "uses-http2",
- "uses-passive-event-listeners"

### Output

### Run Count
