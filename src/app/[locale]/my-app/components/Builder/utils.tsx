import { ENUM_COMPONENTS, IVDOMNode } from '../interfaces';

export function findNodeById(node: IVDOMNode, id: string): IVDOMNode | null {
  if (node._id === id) return node;
  const children = node?.children || [];
  for (const child of children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

export function isDescendant(
  node: IVDOMNode,
  potentialDescendantId: string
): boolean {
  const children = node?.children || [];
  for (const child of children) {
    if (
      child._id === potentialDescendantId ||
      isDescendant(child, potentialDescendantId)
    ) {
      return true;
    }
  }
  return false;
}

export function removeNodeById(
  node: IVDOMNode,
  id: string
): { newNode: IVDOMNode; removedNode: IVDOMNode | null } {
  let removedNode: IVDOMNode | null = null;
  const children = [...(node?.children || [])];
  // Process the children array: if a child matches the id, omit it (and capture it); otherwise, process recursively.
  const newChildren = children.reduce<IVDOMNode[]>((acc, child) => {
    if (child._id === id) {
      removedNode = child;
      return acc;
    } else {
      const { newNode: updatedChild, removedNode: childRemoved } =
        removeNodeById(child, id);
      if (childRemoved) {
        removedNode = childRemoved;
      }
      acc.push(updatedChild);
      return acc;
    }
  }, []);

  const newNode = {
    ...node,
    children: newChildren
  };

  return { newNode, removedNode };
}

export function insertNodeById(
  node: IVDOMNode,
  targetId: string,
  nodeToInsert: IVDOMNode,
  insertionIndex?: number
): IVDOMNode {
  if (node._id === targetId) {
    let newChildren;
    if (typeof insertionIndex === 'number') {
      newChildren = [
        ...(node.children || []).slice(0, insertionIndex),
        nodeToInsert,
        ...(node.children || []).slice(insertionIndex)
      ];
    } else {
      newChildren = [...(node.children || []), nodeToInsert];
    }
    return {
      ...node,
      children: newChildren
    };
  }
  return {
    ...node,
    children: (node.children || []).map((child) =>
      insertNodeById(child, targetId, nodeToInsert, insertionIndex)
    )
  };
}
export function updateTreeOnDrop(
  tree: IVDOMNode,
  draggedId: string,
  dropTargetId: string,
  insertionIndex?: number
): IVDOMNode {
  // Do not allow dropping a node onto itself.
  if (draggedId === dropTargetId) {
    // eslint-disable-next-line no-console
    console.warn("Can't drop a node onto itself.");
    return tree;
  }

  const draggedNode = findNodeById(tree, draggedId);
  if (!draggedNode) {
    // eslint-disable-next-line no-console
    console.warn(`Dragged node with id ${draggedId} not found.`);
    return tree;
  }
  const dropTargetNode = findNodeById(tree, dropTargetId);
  if (!dropTargetNode) {
    // eslint-disable-next-line no-console
    console.warn(`Drop target node with id ${dropTargetId} not found.`);
    return tree;
  }
  // Do not allow dropping into an inline node.
  if (dropTargetNode.inline) {
    // eslint-disable-next-line no-console
    console.warn('Cannot drop a node into an inline node.');
    return tree;
  }
  // Avoid circular reference: disallow dropping a node into one of its descendants.
  if (isDescendant(draggedNode, dropTargetId)) {
    // eslint-disable-next-line no-console
    console.warn('Cannot drop a node into one of its descendants.');
    return tree;
  }

  // Remove the dragged node from its original location.
  const { newNode: treeWithoutDragged, removedNode } = removeNodeById(
    tree,
    draggedId
  );
  if (!removedNode) {
    // eslint-disable-next-line no-console
    console.warn('Failed to remove dragged node from the tree.');
    return tree;
  }

  // Insert the dragged node into the drop target's children.
  const updatedTree = insertNodeById(
    treeWithoutDragged,
    dropTargetId,
    removedNode,
    insertionIndex
  );
  return updatedTree;
}

export type BuilderContext = {
  selectedNodeId: string | null;
  designMode?: boolean;
  gridDisplay?: boolean;
  onClick: (e: any, node: IVDOMNode) => void;
  onTreeUpdate: (
    newTree: IVDOMNode | ((prevTree: IVDOMNode) => IVDOMNode)
  ) => void;
};

// Returns ephemeral props for builder mode (onClick, ephemeral classes, etc.)
export function getBuilderEnhancements(
  node: IVDOMNode,
  builderContext: BuilderContext
): Partial<IVDOMNode['props']> {
  const ephemeralProps: Partial<IVDOMNode['props']> = {};

  // If design mode is on, attach click
  if (builderContext.designMode) {
    ephemeralProps.onClick = (e: any) => {
      e.stopPropagation();
      builderContext.onClick(e, node);
    };
  }
  // Figure out if this node is selected
  const isSelected = node._id && node._id === builderContext.selectedNodeId;
  const selectionClass = isSelected
    ? node.inline
      ? 'selected-element'
      : 'selected-element-block'
    : '';
  const gridClass = builderContext.gridDisplay
    ? 'border border-gray-200 rounded'
    : '';

  ephemeralProps.className = [
    node.context?.styling?.className,
    selectionClass,
    gridClass,
    'cursor-pointer'
  ]
    .filter(Boolean)
    .join(' ');

  if (node.type === ENUM_COMPONENTS.BUTTON) {
    ephemeralProps.type = 'button';
  }
  ephemeralProps.disabled = false;
  return ephemeralProps;
}
export function prepareNodeProps(
  node: IVDOMNode,
  path: string[],
  builderContext?: BuilderContext,
  routeParams?: Record<string, string>
): any {
  const newPath = [...path, node._id];
  const compoundPathId = newPath.join('_');

  // Build extended props from the node’s context.
  const extendedProps = {
    ...node.props,
    className: node.context?.styling?.className,
    id: compoundPathId,
    'data-id': node._id,
    style: node.context?.styling?.style || {}
  };

  // Build ephemeral props (for builder mode) if available.
  let ephemeralProps: Record<string, any> = {};
  if (builderContext) {
    ephemeralProps = getBuilderEnhancements(node, builderContext);
  }

  // Return the merged props.
  return {
    props: {
      ...extendedProps,
      ...ephemeralProps
    },
    context: {
      ...node.context,
      routeParams,
      isBuilderMode: !!builderContext,
      path: newPath
    },
    node
  };
}
