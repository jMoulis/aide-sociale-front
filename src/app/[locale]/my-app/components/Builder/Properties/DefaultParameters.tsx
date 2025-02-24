import FormField from '@/components/form/FormField';
import { usePageBuilderStore } from '../../stores/pagebuilder-store-provider';
import { useProperties } from './useProperties';
import FormLabel from '@/components/form/FormLabel';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import Input from '@/components/form/Input';
import { useEffect, useState } from 'react';

function DefaultParameters() {
  const { selectedNode } = useProperties();
  const [name, setName] = useState(selectedNode?.name || '');

  useEffect(() => {
    setName(selectedNode?.name || '');
  }, [selectedNode?.name]);

  const onUpdateNodeProperty = usePageBuilderStore(
    (state) => state.onUpdateNodeProperty
  );
  const handleInline = (state: CheckedState) => {
    onUpdateNodeProperty({ inline: state }, false, true);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleBlur = () => {
    onUpdateNodeProperty({ name }, false, true);
  };
  return (
    <div>
      <FormField className='flex-row my-2 items-center justify-start'>
        <FormLabel className='mb-0 mr-2'>Inline</FormLabel>
        <Checkbox
          checked={selectedNode?.inline}
          onCheckedChange={handleInline}
        />
      </FormField>
      <FormField className='flex-row my-2 items-center justify-start'>
        <FormLabel className='mb-0 mr-2'>Name</FormLabel>
        <Input value={name} onChange={handleChange} onBlur={handleBlur} />
      </FormField>
    </div>
  );
}
export default DefaultParameters;
