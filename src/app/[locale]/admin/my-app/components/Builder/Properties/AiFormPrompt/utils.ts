import { VDOMContext, VDOMProps } from "@/lib/interfaces/interfaces";
import { ENUM_COMPONENTS, IElementConfig, IVDOMNode } from "../../../interfaces";
import { nanoid } from 'nanoid';
import DOMPurify from 'dompurify';

function styleObjectToString(style: React.CSSProperties): string {
  let styleString = '';
  for (const key in style) {
    if (Object.prototype.hasOwnProperty.call(style, key)) {
      // Convert camelCase to kebab-case.
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      styleString += `${kebabKey}: ${(style as any)[key]}; `;
    }
  }
  return styleString.trim();
}
// Parse pageversion vdom to html.
function vdomToHTML(node: IVDOMNode): string {
  // Determine the tag to use:
  // If a context.as property exists, use it; otherwise, use node.name.
  const tag = node.context?.as || node.name;

  // Start building the attribute string.
  // Always include the data-type attribute with the ENUM_COMPONENTS value.
  let attributes = ` data-type="${node.type}"`;

  // Add any attributes from props (excluding those already handled).
  for (const key in node.props) {
    if (Object.prototype.hasOwnProperty.call(node.props, key)) {
      attributes += ` ${key}="${node.props[key]}"`;
    }
  }

  // Add class and style if provided in context.styling.
  if (node.context?.styling) {
    if (node.context.styling.className) {
      attributes += ` class="${node.context.styling.className}"`;
    }
    if (node.context.styling.style) {
      const styleString = styleObjectToString(node.context.styling.style);
      attributes += ` style="${styleString}"`;
    }
  }

  // Build inner content: first any text content, then recursively add children.
  let innerHTML = '';
  if (node.context?.textContent) {
    innerHTML += node.context.textContent;
  }
  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => {
      innerHTML += vdomToHTML(child);
    });
  }

  // Determine if this is a void element. For simplicity, we assume these common ones.
  const voidElements = ['input', 'img', 'br', 'hr', 'meta', 'link'];
  if (voidElements.includes(tag)) {
    return `<${tag}${attributes} />`;
  } else {
    return `<${tag}${attributes}>${innerHTML}</${tag}>`;
  }
}
export function parseVDOMToHTML(vdomNodes: IVDOMNode[]): string {
  return vdomNodes.map((node) => vdomToHTML(node)).join('');
}

function parseStyle(style: string): React.CSSProperties {
  const styleObject: React.CSSProperties = {};
  style.split(';').forEach((declaration) => {
    if (declaration.trim()) {
      const [property, ...rest] = declaration.split(':');
      if (property && rest) {
        // Convert kebab-case to camelCase.
        const camelCased = property
          .trim()
          .replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
        (styleObject as any)[camelCased] = `${rest.join(':')}`.trim();
      }
    }
  });
  return styleObject;
}
// Recursive function that converts an Element into an IVDOMNode.
function elementToVDOM(
  element: Element,
  path: string[] = [],
  elementsConfig: IElementConfig[]
): IVDOMNode {
  const _id = nanoid();

  // Read the data-type attribute; if not present, fallback to the element's tag name in uppercase.
  const dataType =
    element.getAttribute('data-type') || element.tagName.toUpperCase();

  // Determine the component configuration for this node, if available.
  const config = elementsConfig.find(
    (cfg) => cfg.type === (dataType as ENUM_COMPONENTS)
  );

  // Initialize context and a styling container.
  const context: VDOMContext = { styling: {} };

  // Build the props object from element attributes.
  const props: VDOMProps = {};

  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes.item(i);
    if (attr) {
      // Process class attribute: assign to context.styling.className.
      if (attr.name === 'class') {
        context.styling = context.styling || {};
        context.styling.className = attr.value;
      }
      // Process style attribute: parse and assign to context.styling.style.
      else if (attr.name === 'style') {
        context.styling = context.styling || {};
        context.styling.style = parseStyle(attr.value);
      }
      // Exclude data-type from props (it's already used for mapping).
      else if (attr.name !== 'data-type') {
        props[attr.name] = attr.value;
      }
    }
  }

  // Check if the actual tag differs from the default tag defined in the config.
  if (config && config.tags && config.tags.length > 0) {
    // Find the default tag (explicitly marked or use the first one).
    const defaultTagObj = config.tags.find((t) => t.default) || config.tags[0];
    const defaultTag = defaultTagObj?.tag.toLowerCase();
    const actualTag = element.tagName.toLowerCase();
    if (defaultTag && actualTag !== defaultTag) {
      context.as = actualTag;
    }
  }

  // Process child nodes.
  const children: IVDOMNode[] = [];
  element.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      // Accumulate non-empty trimmed text into context.textContent.
      const text = child.textContent?.trim();
      if (text) {
        context.textContent = context.textContent
          ? context.textContent + ' ' + text
          : text;
      }
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      children.push(
        elementToVDOM(child as Element, [...path, _id], elementsConfig)
      );
    }
  });

  return {
    _id,
    type: dataType as ENUM_COMPONENTS,
    name: element.tagName.toLowerCase(),
    context,
    props,
    path,
    children
  };
}
// Parse HTML string into an array of IVDOMNode.
export function parseHTMLToVDOM(
  html: string,
  elementsConfig: IElementConfig[]
): IVDOMNode[] {
  // Sanitize the HTML using DOMPurify.
  const sanitizedHTML = DOMPurify.sanitize(html);

  // Parse the sanitized HTML into a document.
  const parser = new DOMParser();
  const doc = parser.parseFromString(sanitizedHTML, 'text/html');
  const body = doc.body;
  const vdomNodes: IVDOMNode[] = [];

  // Process each child node in the body.
  body.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      vdomNodes.push(elementToVDOM(node as Element, [], elementsConfig));
    } else if (node.nodeType === Node.TEXT_NODE) {
      const textContent = node.textContent?.trim();
      if (textContent) {
        vdomNodes.push({
          _id: nanoid(),
          type: ENUM_COMPONENTS.TEXT,
          name: 'text',
          context: { textContent },
          props: {},
          children: []
        });
      }
    }
  });

  return vdomNodes;
}

export const tempHTML = `<div data-type="BLOCK" class="min-h-screen bg-gray-100">
  <nav data-type="BLOCK" class="bg-white shadow md:flex md:items-center md:justify-between py-4 md:px-10 px-7">
    <div data-type="BLOCK" class="flex justify-between items-center">
      <h1 data-type="TEXT" class="font-bold text-2xl text-gray-800">RartCréation</h1>
    </div>
    <ul data-type="BLOCK" class="md:flex md:items-center z-[0] md:z-auto md:static absolute bg-white w-full left-0 md:w-auto md:py-0 py-4 md:pl-0 pl-7 md:opacity-100 opacity-0">
      <li data-type="BLOCK">
        <a data-type="LINK" href="#" class="text-gray-800 md:mx-4 md:w-auto w-full block py-2 px-4 text-center">
          <span data-type="TEXT">Accueil</span>
        </a>
      </li>
      <li data-type="BLOCK">
        <a data-type="LINK" href="#portfolio" class="text-gray-800 md:mx-4 md:w-auto w-full block py-2 px-4 text-center">
          <span data-type="TEXT">Portfolio</span>
        </a>
      </li>
      <li data-type="BLOCK">
        <a data-type="LINK" href="#contact" class="text-gray-800 md:mx-4 md:w-auto w-full block py-2 px-4 text-center">
          <span data-type="TEXT">Contact</span>
        </a>
      </li>
    </ul>
  </nav>
  <section data-type="BLOCK" class="flex items-center justify-center h-screen bg-cover" style="background-image: url('https://firebasestorage.googleapis.com/v0/b/rart-82321.appspot.com/o/medias%2Fimage1.jpeg?alt=media&token=42c200d1-52af-446a-96d5-9055dbe47ea0');">
    <div data-type="BLOCK" class="bg-white bg-opacity-75 p-8 rounded shadow">
      <h2 data-type="TEXT" class="text-4xl font-bold text-gray-900">
        Bienvenue à RartCréation
      </h2>
      <p data-type="TEXT" class="mt-4 text-gray-600">
        Découvrez mes peintures originales et inspirantes.
      </p>
    </div>
  </section>
  <section data-type="BLOCK" class="container mx-auto px-5 py-24">
  <div data-type="TABS" value="tab1">
    <div data-type="TABSLIST">
      <span data-type="TABSTRIGGER" value="tab1">
        <span data-type="TEXT">Tab1</span>
      </span>
      <span data-type="TABSTRIGGER" value="tab2">
        <span data-type="TEXT">Tab2</span>
      </span>
    </div>
    <div data-type="TABSCONTENT" value="tab1">
      <span data-type="TEXT">Tab content 1</span>
    </div>
    <div data-type="TABSCONTENT" value="tab2">
      <span data-type="TEXT">Tab content 2</span>
    </div>
  </div>
      <div data-type="DIALOG">
      <div data-type="DIALOGTRIGGER">
        <span data-type="TEXT">Button</span>
      </div>
      <div data-type="DIALOGCONTENT">
        <div data-type="DIALOGHEADER">
          <div data-type="DIALOGTITLE">
            <span data-type="TEXT">Je suis le titre de la modal</span>
          </div>
        </div>
        <span data-type="TEXT">Hello content</span>
      </div>
    </div>
    <div data-type="BLOCK" class="flex flex-wrap -m-4">
      <div data-type="BLOCK" class="p-4 w-full md:w-1/3">
        <div data-type="BLOCK" class="flex flex-col bg-white rounded-lg overflow-hidden shadow-lg">
          <div data-type="BLOCK" class="bg-cover bg-center h-48" style="background-image: url('https://firebasestorage.googleapis.com/v0/b/rart-82321.appspot.com/o/medias%2F20231006_131852.jpg?alt=media&token=4f6ba2e2-80f2-4c02-bdd9-50b3a481f9a7');"></div>
          <div data-type="BLOCK" class="p-6">
            <h3 data-type="TEXT" class="text-lg font-bold mb-2">Peinture 1</h3>
            <p data-type="TEXT" class="text-gray-700 text-base">Découvrez l'émotion derrière chaque coup de pinceau.</p>
          </div>
        </div>
      </div>
      <div data-type="BLOCK" class="p-4 w-full md:w-1/3">
        <div data-type="BLOCK" class="flex flex-col bg-white rounded-lg overflow-hidden shadow-lg">
          <div data-type="BLOCK" class="bg-cover bg-center h-48" style="background-image: url('https://firebasestorage.googleapis.com/v0/b/rart-82321.appspot.com/o/medias%2F20231006_131914.jpg?alt=media&token=977deb07-be7f-41bb-b56c-5853c4ced1d3');"></div>
          <div data-type="BLOCK" class="p-6">
            <h3 data-type="TEXT" class="text-lg font-bold mb-2">Peinture 2</h3>
            <p data-type="TEXT" class="text-gray-700 text-base">Chaque œuvre est une fenêtre ouverte sur un monde imaginaire.</p>
          </div>
        </div>
      </div>
      <div data-type="BLOCK" class="p-4 w-full md:w-1/3">
        <div data-type="BLOCK" class="flex flex-col bg-white rounded-lg overflow-hidden shadow-lg">
          <div data-type="BLOCK" class="bg-cover bg-center h-48" style="background-image: url('https://firebasestorage.googleapis.com/v0/b/rart-82321.appspot.com/o/medias%2F20231006_131946.jpg?alt=media&token=1b5e5a1d-dadc-4526-9edd-6bdd18428c86');"></div>
          <div data-type="BLOCK" class="p-6">
            <h3 data-type="TEXT" class="text-lg font-bold mb-2">Peinture 3</h3>
            <p data-type="TEXT" class="text-gray-700 text-base">Laissez-vous emporter par la profondeur des couleurs.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>`;
