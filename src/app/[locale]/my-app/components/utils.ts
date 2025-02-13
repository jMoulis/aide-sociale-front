import { IVDOMNode } from "./interfaces";

export const findNodeById = (root: IVDOMNode, id: string): IVDOMNode | null => {
  if (root._id === id) return root;
  if (!root.children) return null;
  if (!Array.isArray(root.children)) return null;
  for (const child of root.children) {
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
  if (!root.children) return root;

  if (!Array.isArray(root.children)) return root;

  return {
    ...root,
    children: root.children.map((child) => updateNodeById(child, id, updateFn))
  };
};
export const deleteNodeById = (
  root: IVDOMNode,
  id: string
): IVDOMNode | null => {
  if (root._id === id) return null;
  if (!root.children || !Array.isArray(root.children)) return root;
  const newChildren = root.children
    .map(child => deleteNodeById(child, id))
    .filter((child): child is IVDOMNode => child !== null);
  return { ...root, children: newChildren };
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

    console.error("Error parsing CSS:", error);
  } finally {
    // Clean up by removing the <style> element
    document.head.removeChild(styleElement);
  }

  return classSelectors;
}

export const removeNodeFromTree = (
  nodes: IVDOMNode[],
  id: string
): { removedNode: IVDOMNode | null; newNodes: IVDOMNode[] } => {
  let removedNode: IVDOMNode | null = null;

  const filterFn = (node: IVDOMNode): IVDOMNode | null => {
    if (node._id === id) {
      removedNode = node;
      return null;
    }
    if (node.children?.length) {
      const newChildren = node.children
        .map(filterFn)
        .filter(Boolean) as IVDOMNode[];
      return { ...node, children: newChildren };
    }
    return node;
  };

  const newNodes = nodes.map(filterFn).filter(Boolean) as IVDOMNode[];
  return { removedNode, newNodes };
};
export const insertNodeIntoTree = (
  nodes: IVDOMNode[],
  targetId: string | null,
  nodeToInsert: IVDOMNode,
  dropIndicator: 'above' | 'below' | null
): IVDOMNode[] => {
  if (targetId === null) {
    // If no target is provided, insert at the root level.
    // You could also decide to insert at the beginning if dropIndicator is 'above'.
    return dropIndicator === 'above'
      ? [nodeToInsert, ...nodes]
      : [...nodes, nodeToInsert];
  }

  // Recursive function to find the parent of the target node.
  const recursiveInsert = (node: IVDOMNode): IVDOMNode => {
    if (node.children?.length) {
      const targetIndex = node.children.findIndex(child => child._id === targetId);
      if (targetIndex !== -1) {
        // Compute the insertion index based on the drop indicator.
        const insertIndex = dropIndicator === 'above' ? targetIndex : targetIndex + 1;
        const newChildren = [...node.children];
        newChildren.splice(insertIndex, 0, nodeToInsert);
        return {
          ...node,
          children: newChildren,
        };
      }
      // Recurse into children if target was not found at this level.
      return {
        ...node,
        children: node.children.map(recursiveInsert)
      };
    }
    return node;
  };

  return nodes.map(recursiveInsert);
};
