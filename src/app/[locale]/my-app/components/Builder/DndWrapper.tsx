import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo
} from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { IVDOMNode } from '../interfaces';
import { prepareNodeProps, updateTreeOnDrop } from './utils';
import { ComponentsMap } from './Components/ComponentsMap';

interface DndWrapperProps {
  node: IVDOMNode;
  onTreeUpdate: (
    newTree: IVDOMNode | ((prevTree: IVDOMNode) => IVDOMNode)
  ) => void;
  builderContext?: any;
}

const Indicator: React.FC<{ height: number }> = ({ height }) => (
  <div
    style={{
      height: `${height}px`,
      backgroundColor: 'blue',
      transition: 'height 0.3s ease',
      margin: '4px 0'
    }}
  />
);

const DndWrapper: React.FC<DndWrapperProps> = ({
  node,
  onTreeUpdate,
  builderContext
}) => {
  const [indicatorIndex, setIndicatorIndex] = useState<number | null>(null);
  const [draggedHeight, setDraggedHeight] = useState<number>(0);

  const nodeRef = useRef<HTMLDivElement>(null);
  const childrenContainerRef = useRef<HTMLDivElement>(null);

  const mergedProps = prepareNodeProps(
    node,
    node.path ?? ([] as string[]),
    builderContext
  );

  // useDrag hook.
  const [_, dragRef] = useDrag({
    type: 'ITEM_TYPE',
    item: () => {
      const height = nodeRef.current?.getBoundingClientRect().height || 0;
      return { id: node._id, height };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  // Now, instead of using a fixed child count, use DOM queries to calculate positions.
  const calculateDynamicIndex = useCallback(
    (clientOffset: { x: number; y: number }) => {
      if (!childrenContainerRef.current) return 0;
      // Query all direct child elements that have a data-id attribute.
      const childElements = Array.from(
        childrenContainerRef.current.querySelectorAll('[data-id]')
      );
      // For each child, get its bounding box.
      const bounds = childElements.map((el) => el.getBoundingClientRect());
      // Now, find the index where clientOffset.y is less than the midpoint of the child's vertical range.
      for (let i = 0; i < bounds.length; i++) {
        const { top, height } = bounds[i];
        // Calculate a midpoint or a threshold.
        const threshold = top + height / 2;
        if (clientOffset.y < threshold) {
          return i;
        }
      }
      return bounds.length;
    },
    []
  );

  // useDrop hook.
  const [{ isOver }, dropRef] = useDrop({
    accept: 'ITEM_TYPE',
    hover: (draggedItem: { id: string; height: number }, monitor) => {
      if (!monitor.isOver({ shallow: true })) {
        setIndicatorIndex(null);
        return;
      }
      if (node.inline) {
        setIndicatorIndex(null);
        return;
      }
      if (draggedItem?.height) {
        setDraggedHeight(draggedItem.height);
      }
      const clientOffset = monitor.getClientOffset();
      if (clientOffset) {
        const idx = calculateDynamicIndex(clientOffset);
        setIndicatorIndex(idx);
      }
    },
    drop: (draggedItem: { id: string; height: number }, monitor) => {
      if (!monitor.isOver({ shallow: true })) return;
      setIndicatorIndex(null);
      if (monitor.didDrop()) return;
      if (node.inline) {
        // eslint-disable-next-line no-console
        console.warn(`Cannot drop on inline element ${node._id}`);
        return;
      }
      if (draggedItem.id === node._id) return;
      const clientOffset = monitor.getClientOffset();
      let insertionIndex = 0;
      if (clientOffset) {
        insertionIndex = calculateDynamicIndex(clientOffset);
      }
      onTreeUpdate((prevTree) =>
        updateTreeOnDrop(prevTree, draggedItem.id, node._id, insertionIndex)
      );
      // eslint-disable-next-line no-console
      console.log(`Dropped node ${draggedItem.id} on node ${node._id}`);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true })
    })
  });

  useEffect(() => {
    if (!isOver) {
      setIndicatorIndex(null);
    }
  }, [isOver]);

  // Merge drag and drop refs.
  const combinedRef = useCallback(
    (element: HTMLDivElement | null) => {
      nodeRef.current = element;
      dragRef(dropRef(element));
    },
    [dragRef, dropRef]
  );

  // Build children with indicator using our dynamic index.
  const childrenWithIndicator: React.ReactNode[] = useMemo(() => {
    let arr: React.ReactNode[] = [];
    if (node.children && node.children.length > 0) {
      // We recursively wrap each child.
      const childrenArray = node.children.map((child) => (
        <DndWrapper
          key={child._id}
          node={child}
          onTreeUpdate={onTreeUpdate}
          builderContext={builderContext}
        />
      ));
      if (indicatorIndex !== null) {
        for (let i = 0; i < childrenArray.length; i++) {
          if (i === indicatorIndex) {
            arr.push(<Indicator key='indicator' height={draggedHeight} />);
          }
          arr.push(childrenArray[i]);
        }
        if (indicatorIndex === childrenArray.length) {
          arr.push(<Indicator key='indicator-end' height={draggedHeight} />);
        }
      } else {
        arr = childrenArray;
      }
    } else {
      if (indicatorIndex === 0) {
        arr.push(<Indicator key='indicator' height={draggedHeight} />);
      }
    }
    return arr;
  }, [
    builderContext,
    draggedHeight,
    indicatorIndex,
    node.children,
    onTreeUpdate
  ]);

  // Render the node using your ComponentsMap.
  const Component = ComponentsMap[node.type] || 'div';

  const renderedNode = useMemo(() => {
    return (
      <Component
        {...mergedProps}
        props={{ ...mergedProps.props, ref: combinedRef }}
        dndChildrenContainerRef={childrenContainerRef}>
        {childrenWithIndicator}
      </Component>
    );
  }, [childrenWithIndicator, mergedProps, Component, combinedRef]);

  return <>{renderedNode}</>;
};

export default DndWrapper;
