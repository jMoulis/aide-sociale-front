import { useMemo } from 'react';
import { usePageBuilderStore } from '../../stores/pagebuilder-store-provider';
import { findNodeById } from '../../utils';
import { ElementConfigProps, IVDOMNode } from '../../interfaces';

type Props = {
  value: any;
  vdom: IVDOMNode | null;
  selectedNode: IVDOMNode | null;
};
type UsePropertiesProps = {
  config?: ElementConfigProps;
};
export function useProperties(params?: UsePropertiesProps): Props {
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
    if (!params?.config) return '';
    if (params.config?.context) {
      return selectedNode?.context?.[params.config.propKey] || '';
    }
    return selectedNode?.props?.[params.config.propKey] || '';
  }, [selectedNode?.props, selectedNode?.context, params]);

  return {
    value,
    vdom,
    selectedNode
  };
}
