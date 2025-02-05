import { usePageBuilderStore } from '../stores/pagebuilder-store-provider';
import { IVDOMNode } from '../interfaces';
import { renderVNode } from '@/app/[locale]/app/components/RenderLayout';
import { FormProvider } from './Components/FormContext';
import { IPageTemplateVersion } from '@/lib/interfaces/interfaces';

interface RenderBuilderProps {
  pageVersion: IPageTemplateVersion;
}

export const RenderBuilder: React.FC<RenderBuilderProps> = ({
  pageVersion
}) => {
  const gridDisplay = usePageBuilderStore((state) => state.gridDisplay);
  const selectedNode = usePageBuilderStore((state) => state.selectedNode);
  const onSelectNode = usePageBuilderStore((state) => state.onSelectNode);
  const designMode = usePageBuilderStore((state) => state.designMode);
  const builderContext = {
    onClick: (e: any, n: IVDOMNode) => onSelectNode(e, n),
    selectedNodeId: selectedNode?._id || null,
    designMode,
    gridDisplay
  };
  return (
    <FormProvider forms={{}} isBuilderMode>
      {renderVNode(pageVersion.vdom, [], builderContext)}
    </FormProvider>
  );
};
