import { useMemo } from 'react';
import { usePageBuilderStore } from '../../stores/pagebuilder-store-provider';
import { findNodeById } from '../../utils';
import { ElementConfigProps, IVDOMNode } from '../../interfaces';

type Props = {
  value: any;
  vdom: IVDOMNode | null;
  selectedNode: IVDOMNode | null;
};
export function useProperties({
  config
}: {
  config: ElementConfigProps;
}): Props {
  const selectedNodeId = usePageBuilderStore(
    (state) => state.selectedNode?._id
  );
  const vdom = usePageBuilderStore(
    (state) => state.pageVersion?.vdom || ({} as IVDOMNode)
  );
  const selectedNode = useMemo(
    () => (selectedNodeId ? findNodeById(vdom, selectedNodeId) : null),
    [vdom, selectedNodeId]
  );
  const value = useMemo(() => {
    if (config.context) {
      return selectedNode?.context?.[config.propKey] || '';
    }
    return selectedNode?.props?.[config.propKey] || '';
  }, [
    config.propKey,
    selectedNode?.props,
    selectedNode?.context,
    config.context
  ]);

  return {
    value,
    vdom,
    selectedNode
  };
}
