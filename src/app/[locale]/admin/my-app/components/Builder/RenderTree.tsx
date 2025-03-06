import React, { useMemo } from 'react';
import { IVDOMNode } from '../interfaces';
import { prepareNodeProps } from './utils';
import { ComponentsMap } from './Components/ComponentsMap';

interface DndWrapperProps {
  node: IVDOMNode;
  builderContext?: any;
}

const RenderTree: React.FC<DndWrapperProps> = ({ node, builderContext }) => {
  const mergedProps = prepareNodeProps(
    node,
    node.path ?? ([] as string[]),
    builderContext
  );

  // Render the node using your ComponentsMap.
  const Component = useMemo(
    () => ComponentsMap[node.type] || 'div',
    [node.type]
  );

  const renderedNode = useMemo(() => {
    return (
      <Component {...mergedProps} props={mergedProps.props}>
        {node.children?.map((child) => (
          <RenderTree
            key={child._id}
            node={child}
            builderContext={builderContext}
          />
        ))}
      </Component>
    );
  }, [Component, mergedProps, node.children, builderContext]);

  return <>{renderedNode}</>;
};

export default RenderTree;
