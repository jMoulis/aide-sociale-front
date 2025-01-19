import { useMemo } from 'react';
import { ElementConfigProps, IVDOMNode } from '../interfaces';
import { usePageBuilderStore } from '../usePageBuilderStore';
import { findNodeById } from '../utils';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';

type Props = {
  config: ElementConfigProps;
};
function PropertyInput({ config }: Props) {
  const selectedNodeId = usePageBuilderStore((state) => state.selectedNodeId);
  const vdom = usePageBuilderStore(
    (state) => state.pageVersion?.vdom || ({} as IVDOMNode)
  );
  const onUpdateNodeProperty = usePageBuilderStore(
    (state) => state.onUpdateNodeProperty
  );
  const selectedNode = useMemo(
    () => (selectedNodeId ? findNodeById(vdom, selectedNodeId) : null),
    [vdom, selectedNodeId]
  );
  const value = useMemo(
    () => selectedNode?.props?.[config.propKey] || '',
    [config.propKey, selectedNode?.props]
  );

  return (
    <FormField>
      <FormLabel className='block'>
        <span className='text-gray-700'>{config.label}:</span>
        <Input
          name={config.propKey}
          value={value}
          onChange={(e) => onUpdateNodeProperty(e.target.name, e.target.value)}
        />
      </FormLabel>
    </FormField>
  );
}
export default PropertyInput;
