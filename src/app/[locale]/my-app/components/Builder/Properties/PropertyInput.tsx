import { ElementConfigProps } from '../../interfaces';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import { usePageBuilderStore } from '../../stores/pagebuilder-store-provider';
import { useProperties } from './useProperties';

type Props = {
  config: ElementConfigProps;
};
function PropertyInput({ config }: Props) {
  const { value } = useProperties({ config });
  const onUpdateNodeProperty = usePageBuilderStore(
    (state) => state.onUpdateNodeProperty
  );
  const handleTextContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateNodeProperty(config.propKey, e.target.value, config.context);
  };
  return (
    <FormField>
      <FormLabel className='block'>
        <span className='text-gray-700'>{config.label}:</span>
        <Input
          name={config.propKey}
          value={value}
          onChange={handleTextContent}
        />
      </FormLabel>
    </FormField>
  );
}
export default PropertyInput;
