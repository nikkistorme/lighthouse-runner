# Lighthouse Runner

## Getting Started

Once you have the code, follow these steps to get started:

1. Install the dependencies: `npm install`
2. Create a parameter file: `npm run init-params`
3. Edit the parameter file to set the [parameters](#parameters) for your report.
4. Run the report: `npm run report`

## Parameters

There are several parameters that can be set in the `params.json` file. The parameters are:

| Name                             | Type       |
|----------------------------------|------------|
| [urls](#urls-string)             | `string[]` |
| [categories](#categories-string) | `string[]` |
| [audits](#audits-string)         | `string[]` |
| [output](#output-object)         | `Object`   |

### `urls: string[]`

The `urls` parameter is a list of URLs to test. For example:

```json
"urls": [
  "https://www.example.com",
  "https://www.example.com/about"
]
```

### `categories: string[]`

The `categories` parameter is a list of which lighthouse report categories to run. The available categories are:

- "performance",
- "accessibility",
- "best-practices",
- "seo",
- "pwa",

### `audits: string[]`

The `audits` parameter is a list of which lighthouse report audits to run. The available audits are:

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

### `output: Object`

The `output` parameter is an object that specifies the format of the report summary.

#### Options
| Name       | Type       | Description                                                                                |
|------------|------------|--------------------------------------------------------------------------------------------|
| format     | `string`   | The format of the report summary. The available formats are `json`, `...`.                 |
| urlFormat  | `string`   | The format of the URL in the report summary. The available formats are `href`, `pathname`. |


### `runCount: `

`runCount: number`
The `runCount` parameter is the number of times to run a lighthouse report for each URL. The average score over all runs for each URL will be calculated for each category and audit.
