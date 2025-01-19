import RenderProperties from './Properties/RenderProperties';
import { useMemo } from 'react';
import { findNodeById } from './utils';
import { usePageBuilderStore } from './usePageBuilderStore';

function RightPanel() {
  const selectedNodeId = usePageBuilderStore((state) => state.selectedNodeId);
  const pageVersion = usePageBuilderStore((state) => state.pageVersion);
  const selectedNode = useMemo(
    () =>
      selectedNodeId && pageVersion?.vdom
        ? findNodeById(pageVersion.vdom, selectedNodeId)
        : null,
    [pageVersion?.vdom, selectedNodeId]
  );
  return (
    <div className='w-1/4 border-l p-4'>
      <h2 className='text-xl font-bold'>Properties</h2>
      {selectedNode ? (
        <>
          <p className='text-gray-500 text-sm'>
            {`Editing "${selectedNode.component}" node (id: ${selectedNode._id})`}
          </p>
          <RenderProperties />
        </>
      ) : (
        <p className='text-gray-500'>No element selected.</p>
      )}
    </div>
  );
}
export default RightPanel;
