### Let's start over and clear the previous code snippets

Before creating the function, we should make sure that the configuration array is enough.
If you think that you want me to add other props or restructure the configuration, please do it. You must place yourself as an expert and consultant.

### Mapping component config:
```javascript
const componentsConfig = [
    {
        "type": "DATETIME",
        "tags": [
            {
                "tag": "input",
                "types": [
                    "datetime-local"
                ]
            }
        ]
    },
    {
        "type": "LIST",
        "tags": [
            {
                "tag": "ul"
            },
            {
                "tag": "ol"
            },
            {
                "tag": "li"
            }
        ]
    },
    {
        "type": "SELECT",
        "tags": [
            {
                "tag": "select"
            }
        ]
    },
    {
        "type": "EMAIL",
        "tags": [
            {
                "tag": "input",
                "types": [
                    "email"
                ]
            }
        ]
    },
    {
        "type": "TOGGLE",
        "tags": [
            {
                "tag": "input",
                "types": [
                    "checkbox"
                ]
            }
        ]
    },
    {
        "type": "FILE",
        "tags": [
            {
                "tag": "input",
                "types": [
                    "file"
                ]
            }
        ]
    },
    {
        "type": "FORM",
        "tags": [
            {
                "tag": "form"
            }
        ]
    },
    {
        "type": "NUMERIC",
        "tags": [
            {
                "tag": "input",
                "types": [
                    "number"
                ]
            }
        ]
    },
    {
        "type": "RADIO",
        "tags": [
            {
                "tag": "input",
                "types": [
                    "radio"
                ]
            }
        ]
    },
    {
        "type": "BLOCK",
        "tags": [
            {
                "tag": "div"
            },
            {
                "tag": "section"
            },
            {
                "tag": "article"
            },
            {
                "tag": "header"
            },
            {
                "tag": "footer"
            },
            {
                "tag": "main"
            },
            {
                "tag": "aside"
            },
            {
                "tag": "nav"
            }
        ]
    },
    {
        "type": "BUTTON",
        "tags": [
            {
                "tag": "button"
            }
        ]
    },
    {
        "type": "DATE",
        "tags": [
            {
                "tag": "input",
                "types": [
                    "date"
                ]
            }
        ]
    },
    {
        "type": "TIME",
        "tags": [
            {
                "tag": "input",
                "types": [
                    "time"
                ]
            }
        ]
    },
    {
        "type": "RANGE",
        "tags": [
            {
                "tag": "input",
                "types": [
                    "range"
                ]
            }
        ]
    },
    {
        "type": "TEXT",
        "tags": [
            {
                "tag": "p"
            },
            {
                "tag": "span"
            },
            {
                "tag": "strong"
            },
            {
                "tag": "em"
            },
            {
                "tag": "small"
            },
            {
                "tag": "mark"
            },
            {
                "tag": "del"
            },
            {
                "tag": "ins"
            },
            {
                "tag": "sub"
            },
            {
                "tag": "sup"
            },
            {
                "tag": "abbr"
            },
            {
                "tag": "q"
            },
            {
                "tag": "cite"
            },
            {
                "tag": "dfn"
            },
            {
                "tag": "code"
            },
            {
                "tag": "samp"
            },
            {
                "tag": "kbd"
            },
            {
                "tag": "var"
            },
            {
                "tag": "pre"
            },
            {
                "tag": "address"
            },
            {
                "tag": "blockquote"
            },
            {
                "tag": "div"
            },
            {
                "tag": "a"
            },
            {
                "tag": "b"
            },
            {
                "tag": "i"
            },
            {
                "tag": "s"
            },
            {
                "tag": "u"
            },
            {
                "tag": "tt"
            },
            {
                "tag": "h1"
            },
            {
                "tag": "h2"
            },
            {
                "tag": "h3"
            },
            {
                "tag": "h4"
            },
            {
                "tag": "h5"
            },
            {
                "tag": "h6"
            }
        ]
    },
    {
        "type": "INPUT",
        "tags": [
            {
                "tag": "input",
                "types": [
                    "text"
                ]
            }
        ]
    },
    {
        "type": "DATERANGE",
        "tags": []
    },
    {
        "type": "RATING",
        "tags": []
    },
    {
        "type": "TEXTAREA",
        "tags": [
            {
                "tag": "textarea"
            }
        ]
    },
    {
        "type": "LINK",
        "tags": [
            {
                "tag": "a"
            }
        ]
    },
    {
        "type": "CHECKBOX",
        "tags": [
            {
                "tag": "input",
                "types": [
                    "checkbox"
                ]
            }
        ]
    },
    {
        "type": "TABS",
        "tags": []
    },
    {
        "type": "TABSCONTENT",
        "tags": []
    },
    {
        "type": "TABSLIST",
        "tags": []
    },
    {
        "type": "TABSTRIGGER",
        "tags": []
    },
    {
        "type": "IMAGE",
        "tags": [
            {
                "tag": "img"
            }
        ]
    },
    {
        "type": "DIALOG",
        "tags": []
    },
    {
        "type": "DIALOGTRIGGER",
        "tags": []
    },
    {
        "type": "DIALOGCONTENT",
        "tags": []
    },
    {
        "type": "DIALOGTITLE",
        "tags": []
    },
    {
        "type": "DIALOGHEADER",
        "tags": []
    },
    {
        "type": "COLLAPSE",
        "tags": []
    },
    {
        "type": "SCHEDULER",
        "tags": []
    },
    {
        "type": "SCHEDULER_FORM",
        "tags": []
    }
]

```

### ENUM_COMPONENTS
```typescript
enum ENUM_COMPONENTS {
  BLOCK = 'BLOCK',
  BUTTON = 'BUTTON',
  CHECKBOX = 'CHECKBOX',
  COLLAPSE = 'COLLAPSE',
  COLLAPSECONTENT = 'COLLAPSECONTENT',
  COLLAPSETRIGGER = 'COLLAPSETRIGGER',
  COLOR = 'COLOR',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  DATERANGE = 'DATERANGE',
  DIALOG = 'DIALOG',
  DIALOGTRIGGER = 'DIALOGTRIGGER',
  DIALOGHEADER = 'DIALOGHEADER',
  DIALOGCONTENT = 'DIALOGCONTENT',
  DIALOGTITLE = 'DIALOGTITLE',
  EMAIL = 'EMAIL',
  FILE = 'FILE',
  FORM = 'FORM',
  INPUT = 'INPUT',
  IMAGE = 'IMAGE',
  LINK = "LINK",
  NUMERIC = 'NUMERIC',
  RADIO = 'RADIO',
  RANGE = 'RANGE',
  RATING = 'RATING',
  LIST = 'LIST',
  SCHEDULER = 'SCHEDULER',
  SCHEDULER_FORM = 'SCHEDULER_FORM',
  SELECT = 'SELECT',
  TABS = 'TABS',
  TABSLIST = 'TABSLIST',
  TABSCONTENT = 'TABSCONTENT',
  TABSTRIGGER = 'TABSTRIGGER',
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  TIME = 'TIME',
  TOGGLE = 'TOGGLE',
}
```

### Output Expected
```typescript
interface IVDOMNode {
  _id: string;
  inline?: boolean;
  type: ENUM_COMPONENTS;
  name?: string;
  context: VDOMContext;
  props: VDOMProps;
  path?: string[];
  children: IVDOMNode[];
}

export type VDOMProps = {
  [key: string]: any;
}

export type LinkAttributes = {
  attr: string;
  value?: string;
  label: string,
};

export type VDOMContext = {
  [key: string]: any;
  styling?: {
    style?: CSSProperties;
    className?: string;
  },
  textContent?: string;
  "options-link"?: LinkAttributes[];
}
```

### here is an html example of a landing page.
```html
<main class="bg-gray-100">
    <header class="bg-white shadow" style="display: flex; justify-content: center; align-items: center;">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-3xl font-bold text-gray-800">Your Company</h1>
      </div>
    </header>
    <section class="container mx-auto px-4 py-20 text-center">
      <h2 class="text-4xl font-extrabold text-gray-900">Welcome to Your Company</h2>
      <p class="mt-4 text-lg text-gray-600">We provide innovative solutions to help your business succeed.</p>
      <a href="#signup" class="mt-8 inline-block bg-blue-600 px-8 py-4 rounded-full text-lg">
        <span class="text-white">Get Started</span>
      </a>
    </section>
    <section class="container mx-auto px-4 py-12">
      <h3 class="text-2xl font-bold text-gray-800 mb-6 text-center">Our Services</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h4 class="text-xl font-bold text-gray-800">Service One</h4>
          <p class="mt-2 text-gray-600">Description of service one.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h4 class="text-xl font-bold text-gray-800">Service Two</h4>
          <p class="mt-2 text-gray-600">Description of service two.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h4 class="text-xl font-bold text-gray-800">Service Three</h4>
          <p class="mt-2 text-gray-600">Description of service three.</p>
        </div>
      </div>
    </section>
    <section id="signup" class="bg-blue-600">
      <div class="container mx-auto px-4 py-12 text-center">
        <h3 class="text-2xl font-bold text-white mb-4">Sign Up for Updates</h3>
        <form class="max-w-md mx-auto">
          <input type="email" placeholder="Your email" class="w-full p-3 rounded-lg mb-4">
          <button type="submit" class="w-full bg-white p-3 rounded-lg font-bold">
          <span className="text-blue-600">Subscribe</span></button>
        </form>
      </div>
    </section>
    <footer class="bg-gray-800">
      <div class="container mx-auto px-4 py-6 text-center">
        <p class="text-gray-400">&copy; 2025 Your Company. All rights reserved.</p>
      </div>
    </footer>
  </main>

```


Ok I added default.

- What about this point:
- **Handling Empty Tag Arrays:**
`Some components (e.g., DATERANGE, RATING, TABS, etc.) have empty "tags" arrays. If these components do not have a direct HTML representation, that’s perfectly fine. However, if you plan to support them later with specific HTML mappings, you might add a comment or placeholder so that it’s clear they are intentionally empty`.

**As you've guessed those are custom unmappable component.**

### Find the right IA instructions strategy:

Here are my ideas:
- Passing the enums components
- Passing the config (maybe adding a description to explain the mean of a component)
- Make the Ai produces the html with the abality to add a data-type - with the right data-type from the config. Which will make it possible to use those components without direct HTML representation.

What do you think? Do you have advices?


Ok I will add a instructions in every config:
**eq: Button**
```json
{
  "type": "BUTTON",
  "instructions": "Use when a Form is created and we want to submit the form. Always place the button at the bottom of the form. A button cannot hold directly a text node. You should always wrap the text node into a TEXT component (span)",
  "tags": [
      {
          "tag": "button"
      }
  ]
}
```

What do you think about this format?

[
  {
    "type": "BLOCK",
    "instructions": "Use for grouping content and layout sections. Represents container elements such as div, section, article, header, footer, main, aside, or nav. If a non-default tag is used, include the 'as' attribute to specify the actual tag.",
    "tags": [
      { "tag": "div", "default": true },
      { "tag": "section" },
      { "tag": "article" },
      { "tag": "header" },
      { "tag": "footer" },
      { "tag": "main" },
      { "tag": "aside" },
      { "tag": "nav" }
    ]
  },
  {
    "type": "BUTTON",
    "instructions": "Use when a form is created and a submission action is required. Always place the button at the bottom of the form. Do not insert text nodes directly; wrap text in a TEXT component (e.g., span).",
    "tags": [
      { "tag": "button", "default": true }
    ]
  },
  {
    "type": "CHECKBOX",
    "instructions": "Use for boolean input. Rendered as an input element with type 'checkbox'. Ensure labels or text are wrapped in a TEXT component.",
    "tags": [
      { "tag": "input", "types": ["checkbox"], "default": true }
    ]
  },
  {
    "type": "COLLAPSE",
    "instructions": "Container for collapsible sections. Used to group COLLAPSETRIGGER and COLLAPSECONTENT components. No direct HTML mapping; render a placeholder element with a data-type attribute.",
    "tags": []
  },
  {
    "type": "COLLAPSECONTENT",
    "instructions": "Container for the content that is shown or hidden in a collapsible section. Must be a child of a COLLAPSE component.",
    "tags": []
  },
  {
    "type": "COLLAPSETRIGGER",
    "instructions": "Element that triggers the collapse/expand action. Should be rendered as a TEXT. Must be a child of a COLLAPSE component.",
    "tags": []
  },
  {
    "type": "COLOR",
    "instructions": "Used for color selection. Rendered as an input element with type 'color'.",
    "tags": [
      { "tag": "input", "types": ["color"], "default": true }
    ]
  },
  {
    "type": "DATE",
    "instructions": "Used for date selection. Rendered as an input element with type 'date'.",
    "tags": [
      { "tag": "input", "types": ["date"], "default": true }
    ]
  },
  {
    "type": "DATETIME",
    "instructions": "Used for selecting both date and time. Rendered as an input element with type 'datetime-local'.",
    "tags": [
      { "tag": "input", "types": ["datetime-local"], "default": true }
    ]
  },
  {
    "type": "DATERANGE",
    "instructions": "Custom component for selecting a range of dates. Does not have a direct HTML mapping; render a placeholder element with a data-type attribute set to DATERANGE.",
    "tags": []
  },
  {
    "type": "DIALOG",
    "instructions": "Container for modal dialogs. May include header, content, and footer. Does not have a direct HTML mapping; render a placeholder element with a data-type attribute.",
    "tags": []
  },
  {
    "type": "DIALOGTRIGGER",
    "instructions": "Element that triggers the display of a dialog. Should include as a Text. Must be a DIALOG child",
    "tags": []
  },
  {
    "type": "DIALOGHEADER",
    "instructions": "Container for the header section of a dialog, containing only a DIALOGTITLE. No direct HTML mapping.  Must be a DIALOG child",
    "tags": []
  },
  {
    "type": "DIALOGCONTENT",
    "instructions": "Container for the main content of a dialog. No direct HTML mapping; use a placeholder element with a data-type attribute. . Must be a DIALOG child",
    "tags": []
  },
  {
    "type": "DIALOGTITLE",
    "instructions": "Used for the title of a dialog. Typically rendered as a heading and should be placed within DIALOGHEADER. . Must be a DIALOGHEADER child",
    "tags": []
  },
  {
    "type": "EMAIL",
    "instructions": "Used for email input. Rendered as an input element with type 'email'.  MUST BE a FORM CHILD",
    "tags": [
      { "tag": "input", "types": ["email"], "default": true }
    ]
  },
  {
    "type": "FILE",
    "instructions": "Used for file selection. Rendered as an input element with type 'file'.",
    "tags": [
      { "tag": "input", "types": ["file"], "default": true }
    ]
  },
  {
    "type": "FORM",
    "instructions": "Represents a form container. Used to group input elements and submit data. Rendered as a form element.",
    "tags": [
      { "tag": "form", "default": true }
    ]
  },
  {
    "type": "INPUT",
    "instructions": "Generic text input field. Rendered as an input element with type 'text'. MUST BE a FORM CHILD",
    "tags": [
      { "tag": "input", "types": ["text"], "default": true }
    ]
  },
  {
    "type": "IMAGE",
    "instructions": "Used to display images. Rendered as an img element. Ensure that an 'alt' attribute is provided for accessibility.",
    "tags": [
      { "tag": "img", "default": true }
    ]
  },
  {
    "type": "LINK",
    "instructions": "Used for hyperlinks. Rendered as an anchor (<a>) element with an 'href' attribute. Wrap text in a TEXT component if needed.",
    "tags": [
      { "tag": "a", "default": true }
    ]
  },
  {
    "type": "NUMERIC",
    "instructions": "Used for numeric input. Rendered as an input element with type 'number'.",
    "tags": [
      { "tag": "input", "types": ["number"], "default": true }
    ]
  },
  {
    "type": "RADIO",
    "instructions": "Used for selecting one option among many. Rendered as an input element with type 'radio'.",
    "tags": [
      { "tag": "input", "types": ["radio"], "default": true }
    ]
  },
  {
    "type": "RANGE",
    "instructions": "Used for selecting a value within a range. Rendered as an input element with type 'range'.",
    "tags": [
      { "tag": "input", "types": ["range"], "default": true }
    ]
  },
  {
    "type": "RATING",
    "instructions": "Custom component for a rating interface. Does not have a direct HTML mapping; render a placeholder element with a data-type attribute set to RATING.",
    "tags": []
  },
  {
    "type": "LIST",
    "instructions": "Used to display lists. Rendered as an unordered (ul) or ordered (ol) list with list items (li) representing each item. A LIST can only hold one direct child. Which could be any element",
    "tags": [
      { "tag": "ul", "default": true },
      { "tag": "ol" },
      { "tag": "li" }
    ]
  },
  {
    "type": "SCHEDULER",
    "instructions": "Custom component for scheduling interfaces. Does not have a direct HTML mapping; render a placeholder element with a data-type attribute set to SCHEDULER.",
    "tags": []
  },
  {
    "type": "SCHEDULER_FORM",
    "instructions": "Custom component for scheduling forms. Does not have a direct HTML mapping; render a placeholder element with a data-type attribute set to SCHEDULER_FORM. Must be a SCHEDULER child",
    "tags": []
  },
  {
    "type": "SELECT",
    "instructions": "Used for dropdown selection. Rendered as a select element containing option children.",
    "tags": [
      { "tag": "select", "default": true }
    ]
  },
  {
    "type": "TABS",
    "instructions": "Custom component for tabbed interfaces. Does not have a direct HTML mapping; use subcomponents (TABSLIST, TABSTRIGGER, TABSCONTENT) within this container.",
    "tags": []
  },
  {
    "type": "TABSLIST",
    "instructions": "Custom component for the tab list. Does not have a direct HTML mapping; render a placeholder element with a data-type attribute set to TABSLIST.",
    "tags": []
  },
  {
    "type": "TABSCONTENT",
    "instructions": "Custom component for the content area of a tabbed interface. Does not have a direct HTML mapping; render a placeholder element with a data-type attribute set to TABSCONTENT.",
    "tags": []
  },
  {
    "type": "TABSTRIGGER",
    "instructions": "Custom component for tab triggers. Does not have a direct HTML mapping; render a placeholder element with a data-type attribute set to TABSTRIGGER.",
    "tags": []
  },
  {
    "type": "TEXT",
    "instructions": "Used for displaying text content. Wrap plain text nodes in this component. Can be rendered as various inline or block elements (e.g., p, span, strong). Avoid inserting text directly into interactive components.",
    "tags": [
      { "tag": "p", "default": true },
      { "tag": "span" },
      { "tag": "strong" },
      { "tag": "em" },
      { "tag": "small" },
      { "tag": "mark" },
      { "tag": "del" },
      { "tag": "ins" },
      { "tag": "sub" },
      { "tag": "sup" },
      { "tag": "abbr" },
      { "tag": "q" },
      { "tag": "cite" },
      { "tag": "dfn" },
      { "tag": "code" },
      { "tag": "samp" },
      { "tag": "kbd" },
      { "tag": "var" },
      { "tag": "pre" },
      { "tag": "address" },
      { "tag": "blockquote" },
      { "tag": "div" },
      { "tag": "a" },
      { "tag": "b" },
      { "tag": "i" },
      { "tag": "s" },
      { "tag": "u" },
      { "tag": "tt" },
      { "tag": "h1" },
      { "tag": "h2" },
      { "tag": "h3" },
      { "tag": "h4" },
      { "tag": "h5" },
      { "tag": "h6" }
    ]
  },
  {
    "type": "TEXTAREA",
    "instructions": "Used for multi-line text input. Rendered as a textarea element.",
    "tags": [
      { "tag": "textarea", "default": true }
    ]
  },
  {
    "type": "TIME",
    "instructions": "Used for selecting a time. Rendered as an input element with type 'time'.",
    "tags": [
      { "tag": "input", "types": ["time"], "default": true }
    ]
  },
  {
    "type": "TOGGLE",
    "instructions": "Used for binary toggling. Rendered as an input element with type 'checkbox' or a custom toggle component. Ensure any accompanying text is wrapped in a TEXT component.",
    "tags": [
      { "tag": "input", "types": ["checkbox"], "default": true }
    ]
  }
]