module.exports = (port) => {
  return {
    "id": "backstop_default",
    "viewports": [
      {
        "label": "desktop",
        "width": 1440,
        "height": 900
      }
    ],
    "onBeforeScript": "puppet/onBefore.js",
    "onReadyScript": "puppet/onReady.js",
    "scenarios": [
      {
        "label": "Test Dialogs",
        "url": `http://host.docker.internal:${port}/tests/test-dialogs.html`,
        "hideSelectors": [
          ".tox-spinner"
        ]
      },

      {
        "label": "Test editor oxide markup",
        "url": `http://host.docker.internal:${port}/tests/test-editor-oxide-markup.html`,
      },

      {
        "label": "Test form layout",
        "url": `http://host.docker.internal:${port}/tests/test-form-layout.html`,
      },

      {
        "label": "Test forms",
        "url": `http://host.docker.internal:${port}/tests/test-forms.html`,
      },

      {
        "label": "Test toolbar separation",
        "url": `http://host.docker.internal:${port}/tests/test-toolbar-separation.html`,
        "readyEvent": "backstopjs_ready",
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
        "hideSelectors": [
          ".tox-spinner"
        ]
      },

      {
        "label": "Test Collections",
        "url": `http://host.docker.internal:${port}/tests/test-collections.html`,
      },

      {
        "label": "Test Collections skinning 1",
        "url": `http://host.docker.internal:${port}/tests/test-collections-skinning-1.html`,
      },

      {
        "label": "Test Collections skinning 2",
        "url": `http://host.docker.internal:${port}/tests/test-collections-skinning-2.html`,
      },

      {
        "label": "Test Toolbar button states – default",
        "url": `http://host.docker.internal:${port}/tests/test-toolbar-button-states.html`,
      },
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
