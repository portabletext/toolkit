/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/buildMarksTree.test.ts TAP buildMarksTree: handles leading inline objects in tree > must match snapshot 1`] = `
Array [
  Object {
    "_key": "a",
    "_type": "image",
    "src": "/some/image.png",
  },
  Object {
    "_type": "@text",
    "text": "Include",
  },
  Object {
    "_type": "@text",
    "text": " the image.",
  },
]
`

exports[`test/buildMarksTree.test.ts TAP buildMarksTree: handles trailing inline objects in tree > must match snapshot 1`] = `
Array [
  Object {
    "_type": "@text",
    "text": "Include",
  },
  Object {
    "_type": "@text",
    "text": " the image.",
  },
  Object {
    "_key": "c",
    "_type": "image",
    "src": "/some/image.png",
  },
]
`

exports[`test/buildMarksTree.test.ts TAP buildMarksTree: includes inline objects in tree > must match snapshot 1`] = `
Array [
  Object {
    "_type": "@text",
    "text": "Include",
  },
  Object {
    "_key": "h",
    "_type": "image",
    "src": "/some/image.png",
  },
  Object {
    "_type": "@text",
    "text": " the image.",
  },
]
`

exports[`test/buildMarksTree.test.ts TAP buildMarksTree: includes inline objects in tree, with surrounding marks > must match snapshot 1`] = `
Array [
  Object {
    "_key": "a",
    "_type": "@span",
    "children": Array [
      Object {
        "_key": "a",
        "_type": "@span",
        "children": Array [
          Object {
            "_type": "@text",
            "text": "Include",
          },
        ],
        "markDef": undefined,
        "markKey": "em",
        "markType": "em",
      },
    ],
    "markDef": undefined,
    "markKey": "strong",
    "markType": "strong",
  },
  Object {
    "_key": "h",
    "_type": "image",
    "src": "/some/image.png",
  },
  Object {
    "_key": "z",
    "_type": "@span",
    "children": Array [
      Object {
        "_key": "z",
        "_type": "@span",
        "children": Array [
          Object {
            "_type": "@text",
            "text": " the image.",
          },
        ],
        "markDef": undefined,
        "markKey": "em",
        "markType": "em",
      },
    ],
    "markDef": undefined,
    "markKey": "strong",
    "markType": "strong",
  },
]
`

exports[`test/buildMarksTree.test.ts TAP buildMarksTree: joins on adjacent spans with same annotation > must match snapshot 1`] = `
Array [
  Object {
    "_key": "a",
    "_type": "@span",
    "children": Array [
      Object {
        "_type": "@text",
        "text": "Portable",
      },
      Object {
        "_type": "@text",
        "text": " Text!",
      },
    ],
    "markDef": Object {
      "_key": "link",
      "_type": "link",
      "href": "https://portabletext.org",
    },
    "markKey": "link",
    "markType": "link",
  },
]
`

exports[`test/buildMarksTree.test.ts TAP buildMarksTree: nests correctly, extracts correct \`markDef\` > must match snapshot 1`] = `
Array [
  Object {
    "_type": "@text",
    "text": "This block ",
  },
  Object {
    "_type": "@text",
    "text": "",
  },
  Object {
    "_key": undefined,
    "_type": "@span",
    "children": Array [
      Object {
        "_type": "@text",
        "text": "contains",
      },
      Object {
        "_key": undefined,
        "_type": "@span",
        "children": Array [
          Object {
            "_type": "@text",
            "text": "a link",
          },
        ],
        "markDef": Object {
          "_key": "s0m3l1nk",
          "_type": "link",
          "href": "https://some.example/",
        },
        "markKey": "s0m3l1nk",
        "markType": "link",
      },
      Object {
        "_type": "@text",
        "text": " and some bolded text",
      },
    ],
    "markDef": undefined,
    "markKey": "strong",
    "markType": "strong",
  },
]
`
