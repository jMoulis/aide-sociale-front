import SceneDynamicStyle from './SceneDynamicStyle';
import { BuilderContext } from './utils';
import { IVDOMNode } from '../interfaces';
import { usePageBuilderStore } from '../stores/pagebuilder-store-provider';
import DndWrapper from './DndWrapper';
import PageBuilderDesignStyle from './PageBuilderDesignStyle';

function FrameContentWrapper() {
  const pageVersion = usePageBuilderStore((state) => state.pageVersion);

  const gridDisplay = usePageBuilderStore((state) => state.gridDisplay);
  const selectedNode = usePageBuilderStore((state) => state.selectedNode);
  const onSelectNode = usePageBuilderStore((state) => state.onSelectNode);
  const designMode = usePageBuilderStore((state) => state.designMode);
  const onTreeUpdate = usePageBuilderStore((state) => state.onTreeUpdate);

  const builderContext: BuilderContext = {
    onClick: (e: any, n: IVDOMNode) => onSelectNode(e, n),
    onTreeUpdate,
    selectedNodeId: selectedNode?._id || null,
    designMode,
    gridDisplay
  };

  if (!pageVersion) return <span>Select page version</span>;
  return (
    <>
      <SceneDynamicStyle />
      <PageBuilderDesignStyle />
      <DndWrapper
        node={pageVersion?.vdom}
        onTreeUpdate={onTreeUpdate}
        builderContext={builderContext}
      />
    </>
  );
}
export default FrameContentWrapper;
