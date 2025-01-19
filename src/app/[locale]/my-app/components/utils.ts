import { IVDOMNode } from "./interfaces";

export const findNodeById = (root: IVDOMNode, id: string): IVDOMNode | null => {
  if (root._id === id) return root;
  if (!root.children) return null;
  for (const child of root.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
};

export const updateNodeById = (
  root: IVDOMNode,
  id: string,
  updateFn: (node: IVDOMNode) => IVDOMNode
): IVDOMNode => {
  if (root._id === id) {
    return updateFn({ ...root });
  }
  if (!root.children) return root;

  return {
    ...root,
    children: root.children.map((child) => updateNodeById(child, id, updateFn))
  };
};