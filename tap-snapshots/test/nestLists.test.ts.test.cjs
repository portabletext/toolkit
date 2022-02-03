/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/nestLists.test.ts TAP nestLists: assumes level is 1 if not set > must match snapshot 1`] = `
Array [
  Object {
    "_key": "A0-parent",
    "_type": "@list",
    "children": Array [
      Object {
        "_key": "A0",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Bullet 1",
          },
        ],
        "listItem": "bullet",
      },
    ],
    "level": 1,
    "listItem": "bullet",
    "mode": "html",
  },
  Object {
    "_key": "B0-parent",
    "_type": "@list",
    "children": Array [
      Object {
        "_key": "B0",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Bullet 2",
          },
        ],
        "listItem": "number",
      },
    ],
    "level": 1,
    "listItem": "number",
    "mode": "html",
  },
]
`

exports[`test/nestLists.test.ts TAP nestLists: ends lists when non-list item occurs > must match snapshot 1`] = `
Array [
  Object {
    "_key": "A0-parent",
    "_type": "@list",
    "children": Array [
      Object {
        "_key": "A0",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Bullet 1",
          },
        ],
        "level": 1,
        "listItem": "bullet",
      },
      Object {
        "_key": "B1",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Bullet 2",
          },
        ],
        "level": 1,
        "listItem": "bullet",
      },
    ],
    "level": 1,
    "listItem": "bullet",
    "mode": "html",
  },
  Object {
    "_type": "map",
  },
  Object {
    "_key": "C0-parent",
    "_type": "@list",
    "children": Array [
      Object {
        "_key": "C0",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Number 1",
          },
        ],
        "level": 1,
        "listItem": "number",
      },
      Object {
        "_key": "D1",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Number 2",
          },
        ],
        "level": 1,
        "listItem": "number",
      },
    ],
    "level": 1,
    "listItem": "number",
    "mode": "html",
  },
]
`

exports[`test/nestLists.test.ts TAP nestLists: handles deeper/shallower transitions correctly in direct mode > must match snapshot 1`] = `
Array [
  Object {
    "_key": "A0-parent",
    "_type": "@list",
    "children": Array [
      Object {
        "_key": "A0",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Level 1, A",
          },
        ],
        "level": 1,
        "listItem": "bullet",
      },
      Object {
        "_key": "B1",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Level 1, B",
          },
        ],
        "level": 1,
        "listItem": "bullet",
      },
      Object {
        "_key": "C0-parent",
        "_type": "@list",
        "children": Array [
          Object {
            "_key": "C0",
            "_type": "block",
            "children": Array [
              Object {
                "_type": "span",
                "text": "Level 2, C",
              },
            ],
            "level": 2,
            "listItem": "bullet",
          },
          Object {
            "_key": "D1",
            "_type": "block",
            "children": Array [
              Object {
                "_type": "span",
                "text": "Level 2, D",
              },
            ],
            "level": 2,
            "listItem": "bullet",
          },
          Object {
            "_key": "E0-parent",
            "_type": "@list",
            "children": Array [
              Object {
                "_key": "E0",
                "_type": "block",
                "children": Array [
                  Object {
                    "_type": "span",
                    "text": "Level 3, E",
                  },
                ],
                "level": 3,
                "listItem": "bullet",
              },
              Object {
                "_key": "F1",
                "_type": "block",
                "children": Array [
                  Object {
                    "_type": "span",
                    "text": "Level 3, F",
                  },
                ],
                "level": 3,
                "listItem": "bullet",
              },
            ],
            "level": 3,
            "listItem": "bullet",
            "mode": "direct",
          },
          Object {
            "_key": "G0",
            "_type": "block",
            "children": Array [
              Object {
                "_type": "span",
                "text": "Level 2, G",
              },
            ],
            "level": 2,
            "listItem": "bullet",
          },
          Object {
            "_key": "H1",
            "_type": "block",
            "children": Array [
              Object {
                "_type": "span",
                "text": "Level 2, H",
              },
            ],
            "level": 2,
            "listItem": "bullet",
          },
          Object {
            "_key": "I0-parent",
            "_type": "@list",
            "children": Array [
              Object {
                "_key": "I0",
                "_type": "block",
                "children": Array [
                  Object {
                    "_type": "span",
                    "text": "Level 3, I",
                  },
                ],
                "level": 3,
                "listItem": "bullet",
              },
              Object {
                "_key": "J1",
                "_type": "block",
                "children": Array [
                  Object {
                    "_type": "span",
                    "text": "Level 3, J",
                  },
                ],
                "level": 3,
                "listItem": "bullet",
              },
            ],
            "level": 3,
            "listItem": "bullet",
            "mode": "direct",
          },
        ],
        "level": 2,
        "listItem": "bullet",
        "mode": "direct",
      },
    ],
    "level": 1,
    "listItem": "bullet",
    "mode": "direct",
  },
  Object {
    "_key": "K0-parent",
    "_type": "@list",
    "children": Array [
      Object {
        "_key": "K0",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Level 1, K",
          },
        ],
        "level": 1,
        "listItem": "number",
      },
      Object {
        "_key": "L1",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Level 1, L",
          },
        ],
        "level": 1,
        "listItem": "number",
      },
    ],
    "level": 1,
    "listItem": "number",
    "mode": "direct",
  },
]
`

exports[`test/nestLists.test.ts TAP nestLists: handles deeper/shallower transitions correctly in html mode > must match snapshot 1`] = `
Array [
  Object {
    "_key": "A0-parent",
    "_type": "@list",
    "children": Array [
      Object {
        "_key": "A0",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Level 1, A",
          },
        ],
        "level": 1,
        "listItem": "bullet",
      },
      Object {
        "_key": "B1",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Level 1, B",
          },
          Object {
            "_key": "C0-parent",
            "_type": "@list",
            "children": Array [
              Object {
                "_key": "C0",
                "_type": "block",
                "children": Array [
                  Object {
                    "_type": "span",
                    "text": "Level 2, C",
                  },
                ],
                "level": 2,
                "listItem": "bullet",
              },
              Object {
                "_key": "D1",
                "_type": "block",
                "children": Array [
                  Object {
                    "_type": "span",
                    "text": "Level 2, D",
                  },
                  Object {
                    "_key": "E0-parent",
                    "_type": "@list",
                    "children": Array [
                      Object {
                        "_key": "E0",
                        "_type": "block",
                        "children": Array [
                          Object {
                            "_type": "span",
                            "text": "Level 3, E",
                          },
                        ],
                        "level": 3,
                        "listItem": "bullet",
                      },
                      Object {
                        "_key": "F1",
                        "_type": "block",
                        "children": Array [
                          Object {
                            "_type": "span",
                            "text": "Level 3, F",
                          },
                        ],
                        "level": 3,
                        "listItem": "bullet",
                      },
                    ],
                    "level": 3,
                    "listItem": "bullet",
                    "mode": "html",
                  },
                ],
                "level": 2,
                "listItem": "bullet",
              },
              Object {
                "_key": "G0",
                "_type": "block",
                "children": Array [
                  Object {
                    "_type": "span",
                    "text": "Level 2, G",
                  },
                ],
                "level": 2,
                "listItem": "bullet",
              },
              Object {
                "_key": "H1",
                "_type": "block",
                "children": Array [
                  Object {
                    "_type": "span",
                    "text": "Level 2, H",
                  },
                  Object {
                    "_key": "I0-parent",
                    "_type": "@list",
                    "children": Array [
                      Object {
                        "_key": "I0",
                        "_type": "block",
                        "children": Array [
                          Object {
                            "_type": "span",
                            "text": "Level 3, I",
                          },
                        ],
                        "level": 3,
                        "listItem": "bullet",
                      },
                      Object {
                        "_key": "J1",
                        "_type": "block",
                        "children": Array [
                          Object {
                            "_type": "span",
                            "text": "Level 3, J",
                          },
                        ],
                        "level": 3,
                        "listItem": "bullet",
                      },
                    ],
                    "level": 3,
                    "listItem": "bullet",
                    "mode": "html",
                  },
                ],
                "level": 2,
                "listItem": "bullet",
              },
            ],
            "level": 2,
            "listItem": "bullet",
            "mode": "html",
          },
        ],
        "level": 1,
        "listItem": "bullet",
      },
    ],
    "level": 1,
    "listItem": "bullet",
    "mode": "html",
  },
  Object {
    "_key": "K0-parent",
    "_type": "@list",
    "children": Array [
      Object {
        "_key": "K0",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Level 1, K",
          },
        ],
        "level": 1,
        "listItem": "number",
      },
      Object {
        "_key": "L1",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Level 1, L",
          },
        ],
        "level": 1,
        "listItem": "number",
      },
    ],
    "level": 1,
    "listItem": "number",
    "mode": "html",
  },
]
`

exports[`test/nestLists.test.ts TAP nestLists: nests deeper lists inside of parent list in direct mode > must match snapshot 1`] = `
Array [
  Object {
    "_key": "A0-parent",
    "_type": "@list",
    "children": Array [
      Object {
        "_key": "A0",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Bullet 1",
          },
        ],
        "level": 1,
        "listItem": "bullet",
      },
      Object {
        "_key": "B1",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Bullet 2",
          },
        ],
        "level": 1,
        "listItem": "bullet",
      },
      Object {
        "_key": "C0-parent",
        "_type": "@list",
        "children": Array [
          Object {
            "_key": "C0",
            "_type": "block",
            "children": Array [
              Object {
                "_type": "span",
                "text": "Number 1",
              },
            ],
            "level": 2,
            "listItem": "number",
          },
          Object {
            "_key": "D1",
            "_type": "block",
            "children": Array [
              Object {
                "_type": "span",
                "text": "Number 2",
              },
            ],
            "level": 2,
            "listItem": "number",
          },
        ],
        "level": 2,
        "listItem": "number",
        "mode": "direct",
      },
    ],
    "level": 1,
    "listItem": "bullet",
    "mode": "direct",
  },
]
`

exports[`test/nestLists.test.ts TAP nestLists: wraps adjacent list items of different types in separate list nodes > must match snapshot 1`] = `
Array [
  Object {
    "_key": "A0-parent",
    "_type": "@list",
    "children": Array [
      Object {
        "_key": "A0",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Bullet 1",
          },
        ],
        "level": 1,
        "listItem": "bullet",
      },
      Object {
        "_key": "B1",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Bullet 2",
          },
        ],
        "level": 1,
        "listItem": "bullet",
      },
    ],
    "level": 1,
    "listItem": "bullet",
    "mode": "html",
  },
  Object {
    "_key": "C0-parent",
    "_type": "@list",
    "children": Array [
      Object {
        "_key": "C0",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Number 1",
          },
        ],
        "level": 1,
        "listItem": "number",
      },
      Object {
        "_key": "D1",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Number 2",
          },
        ],
        "level": 1,
        "listItem": "number",
      },
    ],
    "level": 1,
    "listItem": "number",
    "mode": "html",
  },
]
`

exports[`test/nestLists.test.ts TAP nestLists: wraps adjacent list items of different types in separate list nodes > must match snapshot 2`] = `
Array [
  Object {
    "_key": "A0-parent",
    "_type": "@list",
    "children": Array [
      Object {
        "_key": "A0",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Bullet 1",
          },
        ],
        "level": 1,
        "listItem": "bullet",
      },
      Object {
        "_key": "B1",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Bullet 2",
          },
        ],
        "level": 1,
        "listItem": "bullet",
      },
    ],
    "level": 1,
    "listItem": "bullet",
    "mode": "html",
  },
  Object {
    "_key": "C0-parent",
    "_type": "@list",
    "children": Array [
      Object {
        "_key": "C0",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Number 1",
          },
        ],
        "level": 1,
        "listItem": "number",
      },
      Object {
        "_key": "D1",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Number 2",
          },
        ],
        "level": 1,
        "listItem": "number",
      },
    ],
    "level": 1,
    "listItem": "number",
    "mode": "html",
  },
]
`

exports[`test/nestLists.test.ts TAP nestLists: wraps adjacent list items of same type/level in toolkit list node > must match snapshot 1`] = `
Array [
  Object {
    "_key": "A0-parent",
    "_type": "@list",
    "children": Array [
      Object {
        "_key": "A0",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "First",
          },
        ],
        "level": 1,
        "listItem": "bullet",
      },
      Object {
        "_key": "B1",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Second",
          },
        ],
        "level": 1,
        "listItem": "bullet",
      },
      Object {
        "_key": "C2",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Third",
          },
        ],
        "level": 1,
        "listItem": "bullet",
      },
    ],
    "level": 1,
    "listItem": "bullet",
    "mode": "html",
  },
]
`

exports[`test/nestLists.test.ts TAP nestLists: wraps deeper lists inside of last list item in html mode > must match snapshot 1`] = `
Array [
  Object {
    "_key": "A0-parent",
    "_type": "@list",
    "children": Array [
      Object {
        "_key": "A0",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Bullet 1",
          },
        ],
        "level": 1,
        "listItem": "bullet",
      },
      Object {
        "_key": "B1",
        "_type": "block",
        "children": Array [
          Object {
            "_type": "span",
            "text": "Bullet 2",
          },
          Object {
            "_key": "C0-parent",
            "_type": "@list",
            "children": Array [
              Object {
                "_key": "C0",
                "_type": "block",
                "children": Array [
                  Object {
                    "_type": "span",
                    "text": "Number 1",
                  },
                ],
                "level": 2,
                "listItem": "number",
              },
              Object {
                "_key": "D1",
                "_type": "block",
                "children": Array [
                  Object {
                    "_type": "span",
                    "text": "Number 2",
                  },
                ],
                "level": 2,
                "listItem": "number",
              },
            ],
            "level": 2,
            "listItem": "number",
            "mode": "html",
          },
        ],
        "level": 1,
        "listItem": "bullet",
      },
    ],
    "level": 1,
    "listItem": "bullet",
    "mode": "html",
  },
]
`
