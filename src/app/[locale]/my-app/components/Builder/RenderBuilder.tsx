import { usePageBuilderStore } from '../stores/pagebuilder-store-provider';
import { IVDOMNode } from '../interfaces';
import { renderVNode } from '@/app/[locale]/app/components/RenderLayout';

interface RenderBuilderProps {
  node: IVDOMNode;
}

export const RenderBuilder: React.FC<RenderBuilderProps> = ({ node }) => {
  const gridDisplay = usePageBuilderStore((state) => state.gridDisplay);
  const selectedNode = usePageBuilderStore((state) => state.selectedNode);
  const onSelectNode = usePageBuilderStore((state) => state.onSelectNode);
  const designMode = usePageBuilderStore((state) => state.designMode);
  const builderContext = {
    onClick: (e: any, n: IVDOMNode) => onSelectNode(e, n),
    selectedNodeId: selectedNode?._id || null, // so the recursion can check each node
    designMode,
    gridDisplay
  };
  return renderVNode(node, [], builderContext);
};
