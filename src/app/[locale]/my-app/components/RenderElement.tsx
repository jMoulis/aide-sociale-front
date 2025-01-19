import { ENUM_COMPONENTS_TYPE, IVDOMNode } from './interfaces';
import { ComponentsMap } from './ComponentsMap';
import { useMemo } from 'react';
import { usePageBuilderStore } from './usePageBuilderStore';

interface RenderElementProps {
  node: IVDOMNode;
}

export const RenderElement: React.FC<RenderElementProps> = ({ node }) => {
  const gridDisplay = usePageBuilderStore((state) => state.gridDisplay);
  const selectedNodeId = usePageBuilderStore((state) => state.selectedNodeId);
  const onSelectNode = usePageBuilderStore((state) => state.onSelectNode);
  const designMode = usePageBuilderStore((state) => state.designMode);
  const isSelected = useMemo(
    () => node._id === selectedNodeId,
    [node._id, selectedNodeId]
  );

  const gridDisplayClass = useMemo(
    () => (gridDisplay ? 'border border-gray-200 rounded' : ''),
    [gridDisplay]
  );

  const baseClass = useMemo(() => {
    const elementClasses = `${node.props?.styling?.className || ''}`;
    return `${designMode ? 'cursor-pointer' : ''} ${elementClasses}` || '';
  }, [node.props?.styling, designMode]);

  const selectedClass = useMemo(
    () =>
      isSelected
        ? node.type === ENUM_COMPONENTS_TYPE.BLOCK
          ? 'selected-element-block'
          : 'selected-element'
        : '',
    [isSelected, node.type]
  );
  const Component = useMemo(
    () => ComponentsMap[node.component],
    [node.component]
  );

  if (Component) {
    return (
      <Component
        node={node}
        isSelected={isSelected}
        gridDisplayClass={gridDisplayClass}
        baseClass={baseClass}
        selectedClass={selectedClass}
        onClick={(e) => onSelectNode(e, node)}
      />
    );
  }
  return <span>{`Not found ${node.component}`}</span>;
};
