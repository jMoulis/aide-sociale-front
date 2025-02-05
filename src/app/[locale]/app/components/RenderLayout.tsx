import React, { PropsWithChildren } from 'react';
import { ComponentsMap } from '../../my-app/components/Builder/ComponentsMap';
import { ENUM_COMPONENTS, IVDOMNode } from '../../my-app/components/interfaces';
import { IPageTemplateVersion, VDOMContext } from '@/lib/interfaces/interfaces';
import { FormProvider } from '../../my-app/components/Builder/Components/FormContext';

type BuilderContext = {
  selectedNodeId: string | null;
  designMode?: boolean;
  gridDisplay?: boolean;
  onClick: (e: any, node: IVDOMNode) => void;
};

// Returns ephemeral props for builder mode (onClick, ephemeral classes, etc.)
function getBuilderEnhancements(
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

interface RenderLayoutProps {
  pageVersion: IPageTemplateVersion;
  routeParams?: any;
  forms: Record<string, any>;
}

export default function RenderLayout({
  pageVersion,
  routeParams,
  forms
}: RenderLayoutProps) {
  // Start with the root node's ID in the path array (or "root" if missing)
  const rootNode = pageVersion.vdom;
  const initialId = rootNode._id || 'root';
  const initialPath = [initialId];

  return (
    <FormProvider forms={forms}>
      {renderVNode(rootNode, initialPath, undefined, routeParams)}
    </FormProvider>
  );
}

export function renderVNode(
  node: IVDOMNode,
  path: string[],
  builderContext?: BuilderContext,
  routeParams?: Record<string, string>
): React.ReactNode {
  const { type, props = { children: [] }, _id } = node;
  const Component = ComponentsMap[type] || type || 'div';

  const nodeOriginalId = _id || `auto_${Math.random().toString(36).slice(2)}`;
  const newPath = [...path, nodeOriginalId];

  const compoundPathId = newPath.join('_');
  const { children, styling, ...restProps } = props;

  const extendedProps = {
    ...restProps,
    className: node.context?.styling?.className,
    id: compoundPathId,
    'data-id': nodeOriginalId,
    path: newPath,
    style: styling?.style || {}
  } as any;

  // Recursively render children
  let childElements: React.ReactNode = null;

  if (Array.isArray(children)) {
    childElements = children.map((childNode, i) => {
      return (
        <React.Fragment key={childNode._id ?? i}>
          {renderVNode(childNode, newPath, builderContext, routeParams)}
        </React.Fragment>
      );
    });
  }
  let ephemeralProps: Record<string, any> = {};

  if (builderContext) {
    ephemeralProps = getBuilderEnhancements(node, builderContext);
  }
  interface PropsWithChildrenAndContext extends PropsWithChildren {
    context: VDOMContext;
    props: any;
    node: IVDOMNode;
  }
  // Merge the props
  const mergedProps: PropsWithChildrenAndContext = {
    context: {
      ...node.context,
      routeParams,
      isBuilderMode: !!builderContext
    },
    node,
    props: { ...extendedProps, ...ephemeralProps }
  };
  return React.createElement(Component, mergedProps, childElements);
}
