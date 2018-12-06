module.exports = (port) => {
  return {
    "id": "backstop_default",
    "viewports": [
      {
        "label": "desktop",
        "width": 1280,
        "height": 15000
      }
    ],
    "onBeforeScript": "puppet/onBefore.js",
    "onReadyScript": "puppet/onReady.js",
    "scenarios": [
      {
        "label": "demo page",
        "url": `http://host.docker.internal:${port}/tinymce/index.html`,
        "hideSelectors": [],
        "removeSelectors": [],
        "selectors": [
          "body"
        ],
        "readyEvent": null,
        "delay": 5000,
        "misMatchThreshold": 0.1
      },

      {
        "label": "Test toolbar separation",
        "url": `http://host.docker.internal:${port}/tests/test-toolbar-separation.html`,
        "hideSelectors": [],
        "removeSelectors": [],
        "selectors": [
          "body"
        ],
        "readyEvent": "backstopjs_ready",
        "delay": 500,
        "misMatchThreshold": 0.1,
        "viewports": [
          {
            "width": 800,
            "height": 440
          }
        ]
      },

      {
        "label": "Test Tiny Comments for TinyMCE 4",
        "url": `http://host.docker.internal:${port}/tests/test-plugin-tinycomments-tinymce4.html`,
        "viewports": [
          {
            "width": 1440,
            "height": 1800
          }
        ]
      }
    ],
    "paths": {
      "bitmaps_reference": "./backstop_data/bitmaps_reference",
      "bitmaps_test": "./scratch/bitmaps_test",
      "engine_scripts": "./backstop_data/engine_scripts",
      "html_report": "./scratch/html_report",
      "ci_report": "./backstop_data/ci_report"
    },
    "report": ["browser"],
    "engine": "puppeteer",
    "engineOptions": {
      "args": ["--no-sandbox"]
    },
    "asyncCaptureLimit": 5,
    "asyncCompareLimit": 50,
    "debug": false,
    "debugWindow": false
  }
}
