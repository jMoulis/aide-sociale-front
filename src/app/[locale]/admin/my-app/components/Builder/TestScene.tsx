import { cn } from '@/lib/utils/shadcnUtils';
import { FC, Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { IVDOMNode } from '../interfaces';
import { ComponentsMap } from './Components/ComponentsMap';
import { prepareNodeProps } from './utils';

interface DraggableItem {
  id: string;
  type: 'BLOCK';
}

/** Détecte si className indique un layout horizontal ou vertical. */
function getOrientation(className?: string): 'vertical' | 'horizontal' {
  if (!className) return 'vertical';
  if (
    className.includes('flex-row') ||
    className.includes('row') ||
    (className.includes('flex') && !className.includes('flex-col'))
  ) {
    return 'horizontal';
  }
  return 'vertical';
}

/** Recherche d'un bloc dans l'arbre. */
function findBlockById(blocks: IVDOMNode[], id: string): IVDOMNode | null {
  for (const block of blocks) {
    if (block._id === id) return block;
    const found = findBlockById(block.children || [], id);
    if (found) return found;
  }
  return null;
}

/** Retire un bloc de l'arbre. */
function removeBlockById(blocks: IVDOMNode[], id: string): IVDOMNode[] {
  return blocks
    .filter((b) => b._id !== id)
    .map((b) => ({ ...b, children: removeBlockById(b.children || [], id) }));
}

/** Insère un bloc au parent "parentId" à l'index "index". */
function insertBlockAtIndex(
  blocks: IVDOMNode[],
  parentId: string,
  index: number,
  blockToInsert: IVDOMNode
): IVDOMNode[] {
  return blocks.map((b) => {
    if (b._id === parentId) {
      const newChildren = [
        ...b.children.slice(0, index),
        blockToInsert,
        ...b.children.slice(index)
      ];
      return { ...b, children: newChildren };
    }
    return {
      ...b,
      children: insertBlockAtIndex(
        b.children || [],
        parentId,
        index,
        blockToInsert
      )
    };
  });
}

/** Déplace un bloc d'un parent à un autre dans l'arbre. */
function moveBlockInTree(
  blocks: IVDOMNode[],
  dragId: string,
  newParentId: string,
  newIndex: number
): IVDOMNode[] {
  const dragBlock = findBlockById(blocks, dragId);
  if (!dragBlock) return blocks;

  const newBlocks = removeBlockById(blocks, dragId);
  if (dragId === newParentId) return newBlocks;
  return insertBlockAtIndex(newBlocks, newParentId, newIndex, dragBlock);
}

type HoverState = 'none' | 'accepted' | 'refused';

/** DropZone : indicateur qui grandit au survol, horizontal ou vertical. */
interface DropZoneProps {
  parentId: string;
  index: number;
  inline: boolean;
  orientation?: 'vertical' | 'horizontal';
  moveBlock: (dragId: string, newParentId: string, newIndex: number) => void;
  onHoverChange: (zondeIdex: number, state: HoverState) => void;
  zoneIndex: number;
}

const DropZone: FC<DropZoneProps> = ({
  parentId,
  index,
  inline,
  orientation = 'vertical',
  moveBlock,
  zoneIndex,
  onHoverChange
}) => {
  const [{ isOver, canDrop }, dropRef] = useDrop<
    DraggableItem,
    void,
    { isOver: boolean; canDrop: boolean }
  >({
    accept: 'BLOCK',
    canDrop: (item) => {
      if (item.id === parentId) return false;
      if (inline) return false;
      return true;
    },
    drop: (item) => {
      moveBlock(item.id, parentId, index);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop()
    })
  });

  useEffect(() => {
    if (isOver) {
      if (canDrop) {
        onHoverChange(zoneIndex, 'accepted');
      } else {
        onHoverChange(zoneIndex, 'refused');
      }
    } else {
      onHoverChange(zoneIndex, 'none');
    }
  }, [isOver, canDrop, onHoverChange, zoneIndex]);

  const style = useMemo(() => {
    const expandedSize = 50;
    const collapsedSize = 2;

    const sizePx =
      isOver && canDrop ? `${expandedSize}px` : `${collapsedSize}px`;
    const isVertical = orientation === 'vertical';

    const commonStyle: React.CSSProperties = {
      transition: 'all 300ms ease',
      backgroundColor: isOver && canDrop ? 'blue' : 'transparent',
      alignSelf: 'stretch'
    };
    return isVertical
      ? { ...commonStyle, width: '100%', height: sizePx }
      : { ...commonStyle, height: '100%', width: sizePx };
  }, [canDrop, isOver, orientation]);

  return <div ref={dropRef as any} style={style} />;
};

/** Block : composant pour un bloc draggable + rendu de ses enfants. */
const DragAndDropWrapper: FC<{
  node: IVDOMNode;
  builderContext?: any;
  moveBlock: (dragId: string, newParentId: string, newIndex: number) => void;
}> = ({ node, moveBlock, builderContext }) => {
  const dropZoneCount = useMemo(
    () => node.children.length + 1,
    [node.children]
  );

  const [hoverStates, setHoverStates] = useState<HoverState[]>(
    Array(dropZoneCount).fill('none')
  );
  const [{ isDragging }, dragRef] = useDrag<
    DraggableItem,
    void,
    { isDragging: boolean }
  >({
    type: 'BLOCK',
    item: { id: node._id, type: 'BLOCK' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const orientation = useMemo(
    () => getOrientation(node.props?.className),
    [node.props?.className]
  );

  // Dès qu'une DropZone change, on met à jour son index => nouveau state
  const onHoverChange = useCallback(
    (zoneIndex: number, newState: HoverState) => {
      setHoverStates((prev) => {
        const clone = [...prev];
        clone[zoneIndex] = newState;
        return clone;
      });
    },
    []
  );

  const dragAndDropClassName = useMemo(() => {
    let blockBg = '';
    let blockBorder = '';
    if (hoverStates.includes('refused')) {
      blockBg = 'bg-red-100';
      blockBorder = 'border-red-500';
    } else if (hoverStates.includes('accepted')) {
      blockBg = 'bg-green-100';
      blockBorder = 'border-green-500';
    }
    return cn(
      '',
      isDragging && 'opacity-50',
      node.props?.className,
      blockBg,
      blockBorder
    );
  }, [hoverStates, isDragging, node.props?.className]);

  const mergedProps = prepareNodeProps(
    node,
    node.path ?? ([] as string[]),
    builderContext
  );
  const Component = ComponentsMap[node.type] || 'div';

  return (
    <Component
      {...mergedProps}
      ref={dragRef}
      props={{
        ...mergedProps.props,
        ref: dragRef,
        className: cn(dragAndDropClassName, mergedProps.props?.className)
      }}>
      <DropZone
        parentId={node._id}
        index={0}
        inline={node.inline || false}
        orientation={orientation}
        moveBlock={moveBlock}
        onHoverChange={onHoverChange}
        zoneIndex={0}
      />
      {node.children.map((child, i) => (
        <Fragment key={child._id}>
          <DragAndDropWrapper
            node={child}
            moveBlock={moveBlock}
            builderContext={builderContext}
          />
          <DropZone
            parentId={node._id}
            index={i + 1}
            inline={node.inline || false}
            orientation={orientation}
            moveBlock={moveBlock}
            zoneIndex={i + 1}
            onHoverChange={onHoverChange}
          />
        </Fragment>
      ))}
    </Component>
  );
};

/** Exemple d'utilisation globale */
const TestScene: FC<{
  node: IVDOMNode;
  builderContext?: any;
  onTreeUpdate: (
    newTree: IVDOMNode | ((prevTree: IVDOMNode) => IVDOMNode)
  ) => void;
}> = ({ node, builderContext, onTreeUpdate }) => {
  const moveBlock = useCallback(
    (dragId: string, newParentId: string, newIndex: number) => {
      const updatedTree = moveBlockInTree(
        [node],
        dragId,
        newParentId,
        newIndex
      );
      const [mainNode] = updatedTree;
      onTreeUpdate(mainNode);
    },
    [node, onTreeUpdate]
  );

  return (
    <>
      {[node].map((block) => (
        <DragAndDropWrapper
          key={block._id}
          node={block}
          moveBlock={moveBlock}
          builderContext={builderContext}
        />
      ))}
    </>
  );
};

export default TestScene;
