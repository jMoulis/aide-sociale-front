import { ENUM_COMPONENTS } from "@/app/[locale]/my-app/components/interfaces";
import { IAiMessage } from "./interfaces"

const elementConfiguration = `[
  {
    "_id": "6fsdf788ff3sdfcabfe0gqsfgqd29kffdb6",
    "type": "DATETIME",
    "vdom": {
      "_id": "fl234fsdfs",
      "type": "BLOCK",
      "context": {
        "as": "fieldset",
        "styling": {
          "className": "flex flex-col mb-1"
        }
      },
      "children": [
        {
          "_id": "dfklqmsldsdfqdfgqdfsdfkqjsd",
          "type": "TEXT",

          "context": {
            "styling": {
              "className": "mb-1 md:text-sm text-lg flex items-center"
            },
            "as": "label",
            "textContent": "DATETIME"
          },
          "props": {
            "htmlFor": "msdldfdfmsqdfgfsdfsdfffsqdf"
          },
          "children": []
        },
        {
          "_id": "msdldfdfmsfsdfsqdfgdfffsqdf",
          "type": "DATETIME",

          "context": {
            "styling": {}
          },
          "children": [],
          "props": {}
        }
      ],
      "props": {}
    }
  },
  {
    "_id": "43861b37-19bf-4t6g-8a1f-faa7acaqdfg9e625",
    "type": "LIST",
    "vdom": {
      "_id": "43861b37-19bf-437b-8a1f-faa7qdfgaca9e625",
      "type": "LIST",
      "children": [],
      "props": {}
    }
  },
  {
    "_id": "6fsdf78fsdf8ff3cabfe029kffdb6",
    "type": "SELECT",
    "vdom": {
      "_id": "fl234fsdfs",
      "type": "BLOCK",
      "context": {
        "as": "fieldset",
        "styling": {
          "className": "flex flex-col mb-1"
        }
      },
      "children": [
        {
          "_id": "dfklqmsldfsdfkqjsd",
          "type": "TEXT",

          "context": {
            "styling": {
              "className": "mb-1 md:text-sm text-lg flex items-center"
            },
            "as": "label",
            "textContent": "SELECT"
          },
          "props": {
            "htmlFor": "msdlfmsfsdfsdfffsqdf"
          }
        },
        {
          "_id": "msdlfmsfsdfsdfffsqdf",
          "type": "SELECT",

          "context": {
            "styling": {}
          },
          "children": [],
          "props": {}
        }
      ],
      "props": {}
    }
  },
  {
    "_id": "6fsdf788ff3cafsdfbfe029kfqdfgfdb6",
    "type": "EMAIL",
    "vdom": {
      "_id": "fl234fsdfssdff",
      "type": "BLOCK",
      "context": {
        "as": "fieldset",
        "styling": {
          "className": "flex flex-col mb-1"
        }
      },
      "children": [
        {
          "_id": "dfklqmsldfsdfkqqdfgjsdsd",
          "type": "TEXT",

          "context": {
            "styling": {
              "className": "mb-1 md:text-sm text-lg flex items-center"
            },
            "as": "label",
            "textContent": "EMAIL"
          },
          "props": {
            "htmlFor": "msdlfmsfsdfsdqdfgfffsqdfsd"
          }
        },
        {
          "_id": "msdlfmsfsdfsdfffqdfgsqdfsd",
          "type": "EMAIL",

          "context": {
            "styling": {}
          },
          "children": [],
          "props": {}
        }
      ],
      "props": {}
    }
  },
  {
    "_id": "678sddfsdf90Olaqsd1sdfefdmlzek6",
    "type": "TOGGLE",
    "vdom": {
      "_id": "fa1d6d7c1-51bc-4a59-b585-f60f2dd6b66a",

      "type": "TOGGLE",
      "context": {},
      "children": [],
      "props": {}
    }
  },
  {
    "_id": "678d8fff3cabf9c1efd0642ffdb6",
    "type": "FILE",

    "vdom": {
      "_id": "fa1d6d7c1-51bc-4a59-b585-f60f2dd6b66a",

      "type": "FILE",
      "context": {},
      "children": [],
      "props": {
        "styling": {}
      }
    }
  },
  {
    "_id": "43861c45-19bf-437b-8a1f-fa45fdfgdfgca9e625",
    "type": "FORM",
    "vdom": {
      "_id": "43861c45-19bf-437b-8a1f-faa7adfggca9e625",
      "type": "FORM",
      "children": [],
      "props": {}
    }
  },
  {
    "_id": "6fsdf78sdf8ff3cabfe029kffdb6",
    "type": "NUMERIC",
    "vdom": {
      "_id": "fl234fsdfs",
      "type": "BLOCK",
      "context": {
        "as": "fieldset",
        "styling": {
          "className": "flex flex-col mb-1"
        }
      },
      "children": [
        {
          "_id": "dfklqmsldfsdfkqjsd",
          "type": "TEXT",

          "context": {
            "styling": {
              "className": "mb-1 md:text-sm text-lg flex items-center"
            },
            "as": "label",
            "textContent": "Numérique"
          },
          "props": {
            "htmlFor": "msdlfmsfsdfsdfffsqdf"
          }
        },
        {
          "_id": "msdlsdffmsfsdfsdfffsqdf",
          "type": "NUMERIC",

          "context": {
            "styling": {}
          },
          "children": [],
          "props": {}
        }
      ],
      "props": {}
    }
  },
  {
    "_id": "678d8fdff3cabf9c1efd0642ffdsdb6",
    "type": "RADIO",
    "vdom": {
      "_id": "fa1d6d7c1-51bc-4a59-b585-f60fsdff2dd6b66a",

      "type": "RADIO",
      "context": {},
      "children": [],
      "props": {}
    }
  },
  {
    "_id": "6788ff3cabsdfffsdf9c1e029dfgkffdb6",
    "type": "BLOCK",
    "vdom": {
      "_id": "43861b37-19bf-437b-8a1f-faa7dfgdfgaca9e625",
      "type": "BLOCK",
      "children": [],
      "props": {}
    }
  },
  {
    "_id": "43811b37-12bf-437c-8a1f-faa7qdgfaca9e625",
    "type": "BUTTON",
    "vdom": {
      "_id": "43861b37-19bf-437b-8a1f-faa7qdfgaca9e625",
      "type": "BUTTON",
      "children": [
        {
          "_id": "43861b37-19bf-437b-8a1f-faaqdfg7aca9e549",
          "type": "TEXT",
          "children": [],
          "props": {},
          "context": {
            "textContent": "Button"
          }
        }
      ],
      "props": {
        "type": "submit"
      }
    }
  },
  {
    "_id": "6fsdf788ff3cfsdfabfe029kgsdfgsdfffdb6",
    "type": "DATE",
    "vdom": {
      "_id": "fl234fsdfs",
      "type": "BLOCK",
      "context": {
        "as": "fieldset",
        "styling": {
          "className": "flex flex-col mb-1"
        }
      },
      "children": [
        {
          "_id": "dfklqmsldfsdsdddfgdfgfkqjsd",
          "type": "TEXT",

          "context": {
            "styling": {
              "className": "mb-1 md:text-sm text-lg flex items-center"
            },
            "as": "label",
            "textContent": "DATE"
          },
          "props": {
            "htmlFor": "msdlfmsfsdfdfgdfgsdfffsqddddf"
          }
        },
        {
          "_id": "msdlfmsfsdfsdffdfgfsqddddf",
          "type": "DATE",

          "context": {
            "styling": {}
          },
          "children": [],
          "props": {}
        }
      ],
      "props": {}
    }
  },
  {
    "_id": "6fsdf788ff3cabfe029kffdb6",
    "type": "TIME",
    "vdom": {
      "_id": "fl234fsdfs",
      "type": "BLOCK",
      "context": {
        "as": "fieldset",
        "styling": {
          "className": "flex flex-col mb-1"
        }
      },
      "children": [
        {
          "_id": "dfklqmsldfsdfkqjsd",
          "type": "TEXT",

          "context": {
            "styling": {
              "className": "mb-1 md:text-sm text-lg flex items-center"
            },
            "as": "label",
            "textContent": "TIME"
          },
          "props": {
            "htmlFor": "msdlfmsfsqdf"
          }
        },
        {
          "_id": "msdlfmsfsdffsqdf",
          "type": "TIME",

          "context": {
            "styling": {
              "className": "flex w-full bg-white rounded-md border border-input px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-blue-400 focus-visible:ring-1 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50 h-9 md:text-sm invalid:border-red-300"
            }
          },
          "children": [],
          "props": {}
        }
      ],
      "props": {}
    }
  },
  {
    "_id": "678sddff3cabf9c1efd0642ffdsdb6",
    "type": "RANGE",
    "vdom": {
      "_id": "fa1d6d7c1-51zerbc-4a59-b585-f60f2dd6b66a",

      "type": "RANGE",
      "context": {},
      "children": [],
      "props": {
        "styling": {}
      }
    }
  },
  {
    "_id": "6788fd3babf9c1e06sdf42ffdb2",
    "type": "TEXT",

    "vdom": {
      "_id": "fa1d6d71-51bc-4a59-b585-f60dfgdfgf2dd6b66a",

      "type": "TEXT",
      "context": {
        "textContent": "Text"
      },
      "children": [],
      "props": {}
    }
  },
  {
    "_id": "6fsdf788ffgdfgg3cabfe029kffdb6",
    "type": "INPUT",
    "vdom": {
      "_id": "fl234fsdfs",
      "type": "BLOCK",
      "context": {
        "as": "fieldset",
        "styling": {
          "className": "flex flex-col mb-1"
        }
      },
      "children": [
        {
          "_id": "dfklqmsldfkqjsd",
          "type": "TEXT",

          "children": [],
          "context": {
            "styling": {
              "className": "mb-1 md:text-sm text-lg flex items-center"
            },
            "as": "label",
            "textContent": "Label"
          },
          "props": {
            "htmlFor": "msdlfmsfsqdf"
          }
        },
        {
          "_id": "msdlfmsfsqdf",
          "type": "INPUT",

          "children": [],
          "context": {
            "styling": {
              "className": "flex w-full bg-white rounded-md border border-input px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-blue-400 focus-visible:ring-1 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50 h-9 md:text-sm invalid:border-red-300"
            }
          },
          "props": {}
        }
      ],
      "props": {}
    }
  },
  {
    "_id": "6fsdf788ff3cabfe0fs29kqdfgffdb6",
    "type": "DATERANGE",
    "vdom": {
      "_id": "fl234fsdfs",
      "type": "BLOCK",
      "context": {
        "as": "fieldset",
        "styling": {
          "className": "flex flex-col mb-1"
        }
      },
      "children": [
        {
          "_id": "dfklqmsldfsdfsdkqjsd",
          "type": "TEXT",

          "context": {
            "styling": {
              "className": "mb-1 md:text-sm text-lg flex items-center"
            },
            "as": "label",
            "textContent": "DATERANGE"
          },
          "props": {
            "htmlFor": "msdlfmsfsdfsdqdfgfffsqdfbgb"
          }
        },
        {
          "_id": "msdlfmsfsdfsdffdqfgfsqdfgbg",
          "type": "DATERANGE",

          "context": {
            "styling": {}
          },
          "children": [],
          "props": {}
        }
      ],
      "props": {}
    }
  },
  {
    "_id": "678sddfsdf3cabf9c1efd0642ffdsdb6",
    "type": "RATING",
    "vdom": {
      "_id": "fa1d6df7c1-51bc-4a59-b585-f60f2dd6b66a",

      "type": "RATING",
      "context": {},
      "children": [],
      "props": {
        "styling": {}
      }
    }
  },
  {
    "_id": "6fssdfdf788ff3cabfe029kfsdfffdb6",
    "type": "TEXTAREA",
    "vdom": {
      "_id": "fl234fsdfs",
      "type": "BLOCK",
      "context": {
        "as": "fieldset",
        "styling": {
          "className": "flex flex-col mb-1"
        }
      },
      "children": [
        {
          "_id": "dfklqmsldfsdfkqjsd",
          "type": "TEXT",

          "context": {
            "styling": {
              "className": "mb-1 md:text-sm text-lg flex items-center"
            },
            "as": "label",
            "textContent": "TEXTAREA"
          },
          "props": {
            "htmlFor": "msdlfmsfsqdf"
          }
        },
        {
          "_id": "msdlfmsfsdffsqdf",
          "type": "TEXTAREA",

          "context": {
            "styling": {
              "className": "flex w-full bg-white rounded-md border border-input px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-blue-400 focus-visible:ring-1 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50 h-9 md:text-sm invalid:border-red-300"
            }
          },
          "children": [],
          "props": {}
        }
      ],
      "props": {}
    }
  },
  {
    "_id": "oq9gFHbAk2CXzY8otJwxr",
    "type": "LINK",
    "vdom": {
      "_id": "JXi53599nYJUXg9xDUOHH",

      "type": "LINK",
      "context": {},
      "children": [
        {
          "_id": "8yKhQujU7CJVY8FpEG_YV",

          "type": "TEXT",
          "children": [],
          "props": {},
          "context": {
            "textContent": "Lien"
          }
        }
      ],
      "props": {}
    }
  },
  {
    "_id": "f1f99df0-sdfffsdf2492-4e6e-a562-de2cdeee7a13",
    "type": "CHECKBOX",
    "vdom": {
      "_id": "fl234fsdsdsdfs",
      "type": "BLOCK",
      "context": {
        "as": "fieldset",
        "styling": {
          "className": "flex flex-col mb-1"
        }
      },
      "children": [
        {
          "_id": "dfklqmsldfsdkqjsd",
          "type": "TEXT",

          "context": {
            "styling": {
              "className": "mb-1 md:text-sm text-lg flex items-center"
            },
            "as": "label",
            "textContent": "Label"
          },
          "props": {
            "htmlFor": "msdsdflfmsfsqdf"
          }
        },
        {
          "_id": "msdsdflfmsfsqdf",
          "type": "CHECKBOX",

          "context": {
            "styling": {}
          },
          "props": {}
        }
      ],
      "props": {}
    }
  },
  {
    "_id": "6788ff3cabsdfffsdf9c1esddd029dfgkffdb6",
    "type": "TABS",

    "vdom": {
      "_id": "43861fsdbsdsd37-19bf-437b-8a1f-faa7dfgdfgaca9e625",
      "type": "TABS",

      "children": [
        {
          "_id": "smdlfk23423_sflssdsdkdjf",
          "type": "TABSLIST",

          "children": [
            {
              "_id": "smdlfk23423_sflssdsdkdjf",
              "type": "TABSTRIGGER",

              "children": [
                {
                  "_id": "4386cxcf1b37-19sdfbf-437b-8a1f-faaqdfg7aca9e549",
                  "type": "TEXT",

                  "children": [],
                  "props": {},
                  "context": {
                    "textContent": "Tab"
                  }
                }
              ],
              "props": {},
              "context": {}
            }
          ],
          "props": {},
          "context": {}
        },
        {
          "_id": "3bWye2pmnaL9j_grEaFnM",

          "type": "TABSCONTENT",
          "context": {},
          "children": [],
          "props": {}
        }
      ],
      "context": {},
      "props": {}
    }
  },
  {
    "_id": "LzZtBCUw-hCk0diZsF-_-",
    "type": "TABSCONTENT",

    "vdom": {
      "_id": "43861b37-19bf-437b-8a1f-faa7dfgdfgaca9e625",
      "type": "TABSCONTENT",
      "children": [],
      "props": {}
    }
  },
  {
    "_id": "TwpT7-d3qVyeGIROsRrpO",
    "type": "TABSLIST",

    "vdom": {
      "_id": "RKN5dcUlW6pMizkrUx17V",
      "type": "TABSLIST",
      "children": [],
      "props": {}
    }
  },
  {
    "_id": "6WyYaIOaQ8nbMw41izoOY",
    "type": "TABSTRIGGER",

    "vdom": {
      "_id": "5Xedt4uad4ZOzLJDZFvsW",
      "type": "TABSTRIGGER",
      "children": [
        {
          "_id": "4386f1b37-19sdfbf-437b-8a1f-faaqdfg7aca9e549",
          "type": "TEXT",

          "children": [],
          "props": {},
          "context": {
            "textContent": "Button"
          }
        }
      ],
      "props": {},
      "context": {}
    }
  },
  {
    "_id": "6788fd3babfbjoB1e06sdf42ffdb2",
    "type": "IMAGE",

    "vdom": {
      "_id": "fa1d6dsdf71-51bc-4a59-b585-f60dfgdfgf2dd6b66a",

      "type": "IMAGE",
      "context": {},
      "children": [],
      "props": {}
    }
  },
  {
    "_id": "DnJAszR4hcO9oGtBUW8sX",
    "type": "DIALOG",
    "vdom": {
      "_id": "aVarTPvLRKtWiZ_IpSjeQ",
      "type": "DIALOG",
      "children": [
        {
          "_id": "9sMLCTbAcvnUY5IaheL7j",
          "type": "DIALOGTRIGGER",
          "children": [
            {
              "_id": "whKUX9Eq9AWofgW_Sy6NB",
              "type": "TEXT",
              "children": [],
              "props": {},
              "context": {
                "textContent": "Button"
              }
            }
          ],
          "props": {},
          "isOpen": true
        },
        {
          "_id": "dZff-W2dljVndMb1On_dL",
          "type": "DIALOGCONTENT",
          "children": [
            {
              "_id": "5kmDS0c_X20_-xPQNMiOJ",
              "type": "DIALOGHEADER",
              "children": [
                {
                  "_id": "oZzd_HkeGZf5f9YUY1hhW",
                  "type": "DIALOGTITLE",
                  "children": [
                    {
                      "_id": "YoJiourDkLpl6Q2H325uv",

                      "type": "TEXT",
                      "context": {
                        "textContent": "Je suis le titre de la modal"
                      },
                      "children": [],
                      "props": {}
                    }
                  ],
                  "props": {}
                }
              ],
              "props": {}
            },
            {
              "_id": "mHPo5oJbaTC3NllLdjm9_",

              "type": "TEXT",
              "context": {
                "textContent": "Hello content"
              },
              "children": [],
              "props": {}
            }
          ],
          "props": {}
        }
      ],
      "props": {}
    }
  },
  {
    "_id": "MINHyUQOepVkBN7oPql9e",
    "type": "DIALOGTRIGGER",
    "vdom": {
      "_id": "43861b37-19bf-437b-8a1f-faa7qdfgaca9e625",
      "type": "DIALOGTRIGGER",
      "children": [
        {
          "_id": "43861b37-19bf-437b-8a1f-faaqdfg7aca9e549",
          "type": "TEXT",
          "children": [],
          "props": {},
          "context": {
            "textContent": "Open"
          }
        }
      ],
      "props": {}
    }
  },
  {
    "_id": "xlvbO-FDK6zqbTuMGqxjD",
    "type": "DIALOGCONTENT",
    "vdom": {
      "_id": "8MBgEO5kg5bUYS0FjDvhv",
      "type": "DIALOGCONTENT",
      "children": [],
      "props": {}
    }
  },
  {
    "_id": "zbBrQe0wTG0EtQJAgNojx",
    "type": "DIALOGTITLE",

    "vdom": {
      "_id": "AVVreN8km1I3JHhNNRBqy",
      "type": "DIALOGTITLE",
      "children": [],
      "props": {}
    }
  },
  {
    "_id": "4RQrTBn56wtEI3IFyqxt9",
    "type": "DIALOGHEADER",

    "vdom": {
      "_id": "iYBrk6RysPmZIkyGgdGhQ",
      "type": "DIALOGHEADER",
      "children": [],
      "props": {}
    }
  },
  {
    "_id": "20ybxhjvCbajapAbSW58k",
    "type": "COLLAPSE",

    "vdom": {
      "_id": "aVarTPvLRKtWixZ_IpSjeQ",
      "type": "COLLAPSE",
      "children": [
        {
          "_id": "9sMLCTbAvcvnUY5IaheL7j",
          "type": "COLLAPSETRIGGER",
          "children": [
            {
              "_id": "whKUX9cEq9AWofgW_Sy6NB",
              "type": "TEXT",
              "children": [],
              "props": {},
              "context": {
                "textContent": "Button"
              }
            }
          ],
          "props": {},
          "isOpen": true
        },
        {
          "_id": "dZff-W2cdljVnddMb1On_dL",
          "type": "COLLAPSECONTENT",
          "children": [
            {
              "_id": "YoJiourDkvLpl6Q2H325uv",

              "type": "TEXT",
              "context": {
                "textContent": "Je suis le titre de la modal"
              },
              "children": [],
              "props": {}
            }
          ],
          "props": {}
        }
      ],
      "props": {}
    }
  },
  {
    "_id": "DkSBBLTMZXEBk2GG56Enq",
    "type": "SCHEDULER",
    "vdom": {
      "_id": "i-RmcJVeSJUHk02x50yQx",
      "type": "SCHEDULER",
      "children": [],
      "props": {}
    }
  },
  {
    "_id": "OErzxIru14rk54WW6HWy9",
    "type": "SCHEDULER_FORM",
    "vdom": {
      "_id": "i-RmcJVeSJUHk02x50ycQx",
      "type": "SCHEDULER_FORM",
      "children": [],
      "props": {}
    }
  }
]
`;
export const aiLayoutInstructions = `You are a web page generator AI. Your job is to produce a JSON structure that represents a dynamic web page. The JSON must follow this structure exactly:

**Elements available:**
- ${Object.values(ENUM_COMPONENTS).join(", ")}
- any valid HTML element

**Elements configuration**:
${elementConfiguration}

**Schema:**
interface IVDOMNode {
  _id: string;
  inline?: boolean;
  type: ;
  name?: string;
  context: {
	styling?: {
    style?: CSSProperties;
    className?: string;
  }
};

Example JSON structure:
{
  "title": string,
  "summaryAiAction": string,
  "vdom": IVDOMNode
}

Where:
1. **title** is a string representing the form title.
2. **summaryAiAction** is a string providing a casual and friendly summary of the actions you took to generate or modify the output.
3. **vdom** is an object of objects
  - The root vdom object must be of type "BLOCK".
  - Each **block** can contain multiple **nodes**.
  - Each **node** can be a form element or another block.
  - Then you must nest all input fields within the form block.

4. Each **node** must include:
   - **_id** (unique identifier string)
   - **type** (${Object.values(ENUM_COMPONENTS).join(" | ")})
   - **label** (display text)
   - **props** (object with additional valid dom element properties)
   - **context** (object with optional styling and other context properties)

5. **Styling**:
  - You can include inline styles in the **styling** object.
  - You can include a **className** string for CSS classes.
  - Classname shoule be a tailwindcss class.

6. **As props**:
  - You can include in the context object a **as** key to specify the type of element to render.
  e.g. { as: "h1" }

**WARNING**: Make sure to return a valid JSON object that matches the schema above, without any comments or extra content and no markdown syntax.

When I give you a request such as:
"Build me landing page."

you should respond with **only** a valid JSON object that matches the exact schema above. **Do not include any extra commentary, explanations, or code blocks—only raw JSON.** The \`summaryAiAction\` field must always be included and should provide a friendly summary of the actions you took to create or modify the form, using a casual and approachable tone.

For example, your output might look like:

{
  "title": "Event Form",
  "summaryAiAction": "I've put together an schdeduler event form for you!",
  "vdom": {
  "_id": "B0lQ9_RzjUUpf-az-ds3M",
  "type": "BLOCK",
  "children": [
    {
      "_id": "8ykm3zgA4F9Yxq-Vmibto",
      "type": "BLOCK",
      "children": [
        {
          "_id": "AhsQy5NuG30aB5YMxFMyH",
          "inline": false,
          "type": "IMAGE",
          "context": {
            "styling": {
              "className": "h-[150px] w-[150px] mr-3 rounded"
            },
            "dataset": {
              "collectionSlug": "organizations",
              "collectionName": "Organisation",
              "pageTemplateVersionId": "Dno33Sd94HmXqXBj--aXL",
              "connexion": {
                "field": "data.imageUrl"
              }
            }
          },
          "children": [],
          "props": {
            "src": ""
          }
        },
        {
          "_id": "Gx0wWM19JGd3DSSWTotD0",
          "inline": false,
          "type": "TEXT",
          "context": {
            "textContent": "L' Matin Maison des enfants",
            "styling": {
              "className": "text-[70px]"
            },
            "dataset": {
              "collectionSlug": "organizations",
              "collectionName": "Organisation",
              "pageTemplateVersionId": "Dno33Sd94HmXqXBj--aXL",
              "connexion": {
                "field": "data.name",
                "routeParam": ""
              }
            }
          },
          "children": [],
          "props": {}
        }
      ],
      "props": {},
      "context": {
        "styling": {
          "style": {},
          "className": "flex bg-white md:m-3 p-3 m-1 rounded-md shadow-sm "
        }
      },
      "name": "Header",
      "isOpen": true
    },
    {
      "_id": "W42Gh_lhUU4h5q66OajPU",
      "type": "BLOCK",
      "children": [],
      "props": {},
      "context": {
        "styling": {
          "style": {},
          "className": "flex"
        }
      },
      "name": "Main",
      "isOpen": true
    }
  ],
  "props": {},
  "context": {
    "styling": {
      "style": {
        "backgroundColor": "#f5f5f9"
      },
      "className": "h-full"
    }
  },
  "name": "Main page",
  "isOpen": true
}
}

Remember:
- Output **only** valid JSON with the specified keys and structure without any markdown syntax.
- Make sure to generate unique IDs for nodes.
- If the user asks for extra fields or changes, just adapt the JSON accordingly without commentary.
- You can use the "summaryAiAction" field to provide a summary of the changes you made. And you can use a casual tone in your responses. Good luck! 🤖
`;


export const aiTemplateInitialMessage: IAiMessage = {
  role: "system",
  content: aiLayoutInstructions
}