import React, { useEffect, useState } from 'react';
import { usePageBuilderStore } from '../../../stores/pagebuilder-store-provider';
import { IVDOMNode } from '../../../interfaces';
import { MoveHandler, NodeApi, Tree } from 'react-arborist';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronRight
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';

const removeNodes = (nodes: IVDOMNode[], dragIds: string[]): IVDOMNode[] => {
  return nodes.reduce((acc: IVDOMNode[], node) => {
    if (dragIds.includes(node._id)) {
      return acc;
    }
    const newChildren = node.children
      ? removeNodes(node.children, dragIds)
      : [];
    acc.push({ ...node, children: newChildren });
    return acc;
  }, []);
};

// Helper to insert nodes into the tree at a specified parent (or at the root if parentId is null)
const insertNodes = (
  nodes: IVDOMNode[],
  parentId: string | null,
  index: number,
  nodesToInsert: IVDOMNode[]
): IVDOMNode[] => {
  if (parentId === null) {
    // Insert at the root level
    const newNodes = [...nodes];
    newNodes.splice(index, 0, ...nodesToInsert);
    return newNodes;
  }
  return nodes.map((node) => {
    if (node._id === parentId) {
      const newChildren = node.children ? [...node.children] : [];
      newChildren.splice(index, 0, ...nodesToInsert);
      return { ...node, children: newChildren };
    }
    if (node.children) {
      return {
        ...node,
        children: insertNodes(node.children, parentId, index, nodesToInsert)
      };
    }
    return node;
  });
};

function Node({ node, style, dragHandle }: any) {
  const onSelectNode = usePageBuilderStore((state) => state.onSelectNode);

  /* This node instance can do many things. See the API reference. */
  const handleSelectNode = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    node.select();
    onSelectNode(event, node.data);
  };

  const handleToggle = () => {
    node.toggle();
  };
  return (
    <div
      style={{
        ...style,
        height: '20px',
        backgroundColor:
          node.willReceiveDrop && !node.data.inline
            ? 'gray'
            : node.isSelected
            ? 'lightblue'
            : 'white'
      }}
      className='grid grid-cols-[15px_1fr] gap-1 rounded'
      ref={dragHandle}>
      <button onClick={handleToggle} className='text-xs'>
        {node.data.inline ? (
          <span />
        ) : (
          <FontAwesomeIcon
            icon={node.isOpen ? faChevronDown : faChevronRight}
          />
        )}
      </button>
      <button
        className='flex items-center w-full text-xs'
        style={{}}
        onClick={handleSelectNode}>
        {node.data.type}
      </button>
    </div>
  );
}
function TreeView() {
  const vdom = usePageBuilderStore((state) => state.pageVersion?.vdom);
  const onTreeUpdate = usePageBuilderStore((state) => state.onTreeUpdate);

  const [treeData, setTreeData] = useState<IVDOMNode[]>([]);

  useEffect(() => {
    if (vdom) {
      setTreeData([vdom]);
    }
  }, [vdom]);

  const handleMove: MoveHandler<IVDOMNode> = ({
    dragIds,
    dragNodes,
    parentId,
    index
  }) => {
    // Convert dragged NodeApi objects to your IVDOMNode data.
    const nodesToInsert: IVDOMNode[] = dragNodes.map(
      (node: NodeApi<IVDOMNode>) => node.data
    );

    // First, remove the dragged nodes from the current tree.
    let newTreeData = removeNodes(treeData, dragIds);

    // Then, insert the dragged nodes into their new location.
    newTreeData = insertNodes(newTreeData, parentId, index, nodesToInsert);
    onTreeUpdate(newTreeData[0]);
    // Update the state.
    setTreeData(newTreeData);
  };

  if (!vdom) {
    return null;
  }
  return (
    <Tree<IVDOMNode>
      data={treeData}
      idAccessor='_id'
      onMove={handleMove}
      rowHeight={20}
      indent={10}
      padding={10}
      disableDrop={({ parentNode }) => !!parentNode.data.inline}>
      {Node}
    </Tree>
  );
}

export default TreeView;
