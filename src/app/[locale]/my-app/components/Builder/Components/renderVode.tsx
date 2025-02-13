import React from 'react';
import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { ENUM_COMPONENTS, IVDOMNode } from '../../interfaces';
import { ComponentsMap } from './ComponentsMap';

export function renderVNode(
  node: IVDOMNode,
  path: string[],
  routeParams?: Record<string, string>,
  listIndex?: number
): React.ReactNode {
  const { type, children, props, _id } = node;
  const Component = ComponentsMap[type] || type || 'div';

  const newPath = [...path, _id];

  const compoundPathId = newPath.join('_');

  const extendedProps = {
    ...props,
    className: node.context?.styling?.className, // Store the created class name
    id: compoundPathId, // Ensure the ID is unique
    'data-id': _id, // Store the original ID
    style: node.context?.styling?.style || {}
  } as any;

  // Recursively render children
  let childElements: React.ReactNode = null;

  if (node.type === ENUM_COMPONENTS.LIST) {
  }
  if (Array.isArray(children)) {
    childElements = children.map((childNode, i) => {
      return (
        <React.Fragment key={childNode._id ?? i}>
          {renderVNode(childNode, newPath, routeParams, listIndex)}
        </React.Fragment>
      );
    });
  }
  // Merge the props
  const mergedProps: PropsWithChildrenAndContext = {
    context: {
      ...node.context,
      listIndex,
      routeParams,
      path: newPath
    },
    node,
    props: extendedProps
  };
  const renderedNode = <Component {...mergedProps}>{childElements}</Component>;
  return renderedNode;
}
