import DeleteButton from '@/components/buttons/DeleteButton';
import { usePageBuilderStore } from '../stores/pagebuilder-store-provider';
import { findNodeById } from '../utils';
import RenderParameters from './Properties/RenderParameters';
import { useMemo } from 'react';

function RightPanel() {
  const selectedNodeId = usePageBuilderStore(
    (state) => state.selectedNode?._id
  );
  const onDeleteNode = usePageBuilderStore((state) => state.onDeleteNode);
  const pageVersion = usePageBuilderStore((state) => state.pageVersion);
  const selectedNode = useMemo(
    () =>
      selectedNodeId && pageVersion?.vdom
        ? findNodeById(pageVersion.vdom, selectedNodeId)
        : null,
    [pageVersion?.vdom, selectedNodeId]
  );

  if (!pageVersion) return;
  return (
    <div className='w-1/4 border-l p-4'>
      <h2 className='text-xl font-bold'>Properties</h2>
      {selectedNode ? (
        <>
          <p className='text-gray-500 text-sm mb-2'>
            {`Editing "${selectedNode.type}" node (id: ${selectedNode._id})`}
          </p>
          <DeleteButton onClick={() => onDeleteNode(selectedNodeId || null)} />
          <RenderParameters />
        </>
      ) : (
        <p className='text-gray-500'>No element selected.</p>
      )}
    </div>
  );
}
export default RightPanel;
