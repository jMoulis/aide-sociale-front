import { IVDOMNode } from "./interfaces";

export const findNodeById = (root: IVDOMNode, id: string): IVDOMNode | null => {
  if (root._id === id) return root;
  if (!root.props.children) return null;
  if (!Array.isArray(root.props.children)) return null;
  for (const child of root.props.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
};

export const updateNodeById = (
  root: IVDOMNode,
  id: string,
  updateFn: (node: IVDOMNode) => IVDOMNode,
): IVDOMNode => {
  if (root._id === id) {
    return updateFn({ ...root });
  }
  if (!root.props.children) return root;

  if (!Array.isArray(root.props.children)) return root;

  return {
    ...root,
    props: {
      ...root.props,
      children: root.props.children.map((child) => updateNodeById(child, id, updateFn))
    }
  };
};
export const deleteNodeById = (
  root: IVDOMNode,
  id: string
): IVDOMNode | null => {
  if (root._id === id) return null;
  if (!root.props.children || !Array.isArray(root.props.children)) return root;
  const newChildren = root.props.children
    .map(child => deleteNodeById(child, id))
    .filter((child): child is IVDOMNode => child !== null);
  return { ...root, props: { ...root.props, children: newChildren } };
};

export function extractClassSelectorsFromString(stylesheetString: string): string[] {
  const classSelectors: string[] = [];

  // Create a <style> element to parse the CSS
  const styleElement = document.createElement('style');
  styleElement.textContent = stylesheetString;

  // Append the <style> element to the document to parse the CSS rules
  document.head.appendChild(styleElement);

  try {
    const sheet = styleElement.sheet as CSSStyleSheet;
    const rules = sheet.cssRules || sheet.rules;

    // Loop through the rules and extract class selectors
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSStyleRule) {
        // Split the selector text and filter selectors starting with `.`
        const selectors = rule.selectorText
          .split(',')
          .map(selector => selector.trim())
          .filter(selector => selector.startsWith('.'));

        // Remove the leading `.` and add the selectors to the array
        selectors.forEach(selector => {
          classSelectors.push(selector.substring(1));
        });
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error parsing CSS:", error);
  } finally {
    // Clean up by removing the <style> element
    document.head.removeChild(styleElement);
  }

  return classSelectors;
}