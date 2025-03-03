import { useMemo } from 'react';
import { usePageBuilderStore } from '../../stores/pagebuilder-store-provider';
import { findNodeById } from '../../utils';
import { ElementConfigProps, IVDOMNode } from '../../interfaces';
import { IStore } from '@/lib/interfaces/interfaces';

type Props = {
  value: any;
  vdom: IVDOMNode | null;
  selectedNode: IVDOMNode | null;
  stores: IStore[];
};
type UsePropertiesProps = {
  config?: ElementConfigProps;
};
export function useProperties(params?: UsePropertiesProps): Props {
  const selectedNodeId = usePageBuilderStore(
    (state) => state.selectedNode?._id
  );
  const pageVersion = usePageBuilderStore((state) => state.pageVersion);
  const selectedNode = useMemo(
    () =>
      selectedNodeId
        ? findNodeById(pageVersion?.vdom || ({} as IVDOMNode), selectedNodeId)
        : null,
    [pageVersion?.vdom, selectedNodeId]
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
    vdom: pageVersion?.vdom || ({} as IVDOMNode),
    selectedNode,
    stores: pageVersion?.stores || []
  };
}
