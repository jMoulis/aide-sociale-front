import invariant from 'tiny-invariant';

import type { Instruction } from '@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item';
import { IVDOMNode } from '../../../interfaces';

export type TreeState = {
  lastAction: TreeAction | null;
  data: IVDOMNode[];
};

export function getInitialTreeState(tree: IVDOMNode[]): TreeState {
  return { data: getInitialData(tree), lastAction: null };
}


export function getInitialData(tree: IVDOMNode[]): IVDOMNode[] {
  return tree;
}

export type TreeAction =
  | {
    type: 'instruction';
    instruction: Instruction;
    itemId: string;
    targetId: string;
  }
  | {
    type: 'toggle';
    itemId: string;
  }
  | {
    type: 'expand';
    itemId: string;
  }
  | {
    type: 'collapse';
    itemId: string;
  }
  | {
    type: "update-item";
    updatedNode: IVDOMNode;
    itemId: string;
  } | { type: 'reset'; data: IVDOMNode[] };

export const tree = {
  remove(data: IVDOMNode[], id: string): IVDOMNode[] {
    return data
      .filter((item) => item._id !== id)
      .map((item) => {
        if (tree.hasChildren(item)) {
          return {
            ...item,
            children: tree.remove(item.children, id),
          };
        }
        return item;
      });
  },
  insertBefore(data: IVDOMNode[], targetId: string, newItem: IVDOMNode): IVDOMNode[] {
    return data.flatMap((item) => {
      if (item._id === targetId) {
        return [newItem, item];
      }
      if (tree.hasChildren(item)) {
        return {
          ...item,
          children: tree.insertBefore(item.children, targetId, newItem),
        };
      }
      return item;
    });
  },
  insertAfter(data: IVDOMNode[], targetId: string, newItem: IVDOMNode): IVDOMNode[] {
    return data.flatMap((item) => {
      if (item._id === targetId) {
        return [item, newItem];
      }

      if (tree.hasChildren(item)) {
        return {
          ...item,
          children: tree.insertAfter(item.children, targetId, newItem),
        };
      }

      return item;
    });
  },
  insertChild(data: IVDOMNode[], targetId: string, newItem: IVDOMNode): IVDOMNode[] {
    return data.flatMap((item) => {
      if (item._id === targetId) {
        // already a parent: add as first child
        return {
          ...item,
          // opening item so you can see where item landed
          isOpen: true,
          children: [newItem, ...item.children],
        };
      }

      if (!tree.hasChildren(item)) {
        return item;
      }

      return {
        ...item,
        children: tree.insertChild(item.children, targetId, newItem),
      };
    });
  },
  find(data: IVDOMNode[], itemId: string): IVDOMNode | undefined {
    for (const item of data) {
      if (item._id === itemId) {
        return item;
      }

      if (tree.hasChildren(item)) {
        const result = tree.find(item.children, itemId);
        if (result) {
          return result;
        }
      }
    }
  },
  getPathToItem({
    current,
    targetId,
    parentIds = [],
  }: {
    current: IVDOMNode[];
    targetId: string;
    parentIds?: string[];
  }): string[] | undefined {
    for (const item of current) {
      if (item._id === targetId) {
        return parentIds;
      }
      const nested = tree.getPathToItem({
        current: item.children,
        targetId: targetId,
        parentIds: [...parentIds, item._id],
      });
      if (nested) {
        return nested;
      }
    }
  },
  hasChildren(item: IVDOMNode): boolean {
    return item.children?.length > 0;
  },
  updateNode(data: IVDOMNode[], item: IVDOMNode, id: string): IVDOMNode[] {
    return data.map((node) => {
      if (node._id === id) {
        return item;
      }
      if (tree.hasChildren(node)) {
        return {
          ...node,
          children: tree.updateNode(node.children, item, id),
        };
      }
      return node;
    }
    );
  },
  updateTree(data: IVDOMNode[]): IVDOMNode[] {
    return data;
  }
};

export function treeStateReducer(state: TreeState, action: TreeAction): TreeState {
  return {
    data: dataReducer(state.data, action),
    lastAction: action,
  };
}

const dataReducer = (data: IVDOMNode[], action: TreeAction) => {
  if (action.type === 'reset') {
    return action.data;
  }
  const item = tree.find(data, (action as any).itemId);
  if (!item) {
    return data;
  }

  if (action.type === 'instruction') {
    const instruction = action.instruction;

    if (instruction.type === 'reparent') {
      const path = tree.getPathToItem({
        current: data,
        targetId: action.targetId,
      });
      invariant(path);
      const desiredId = path[instruction.desiredLevel];
      let result = tree.remove(data, action.itemId);
      result = tree.insertAfter(result, desiredId, item);
      return result;
    }

    // the rest of the actions require you to drop on something else
    if (action.itemId === action.targetId) {
      return data;
    }

    if (instruction.type === 'reorder-above') {
      let result = tree.remove(data, action.itemId);
      result = tree.insertBefore(result, action.targetId, item);
      return result;
    }

    if (instruction.type === 'reorder-below') {
      let result = tree.remove(data, action.itemId);
      result = tree.insertAfter(result, action.targetId, item);
      return result;
    }

    if (instruction.type === 'make-child') {
      let result = tree.remove(data, action.itemId);
      result = tree.insertChild(result, action.targetId, item);
      return result;
    }

    if (instruction.type === "instruction-blocked") {
      // console.warn('TODO: action not implemented', instruction);
      return data;
    }
    return data;
  }

  function toggle(item: IVDOMNode): IVDOMNode {
    if (!tree.hasChildren(item)) {
      return item;
    }

    if (item._id === (action as any).itemId) {
      return { ...item, isOpen: !(item as any).isOpen } as any;
    }

    return { ...item, children: item.children.map(toggle) };
  }

  if (action.type === 'toggle') {
    return data.map(toggle);
  }

  if (action.type === 'expand') {
    if (tree.hasChildren(item) && !(item as any).isOpen) {
      return data.map(toggle);
    }
    return data;
  }

  if (action.type === 'collapse') {
    if (tree.hasChildren(item) && (item as any).isOpen) {
      return data.map(toggle);
    }
    return data;
  }
  if (action.type === "update-item") {
    return tree.updateNode(data, action.updatedNode, action.itemId);
  }

  return data;
};
