import { useState } from 'react';
import { ElementConfigProps } from '../../interfaces';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import { usePageBuilderStore } from '../../stores/pagebuilder-store-provider';
import Button from '@/components/buttons/Button';
import {
  faFloppyDisk,
  faTimes
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useProperties } from './useProperties';

type Props = {
  config: ElementConfigProps;
};
function AsInput({ config }: Props) {
  const { value } = useProperties({ config });
  const [tempValue, setTempValue] = useState(value);
  const onUpdateNodeProperty = usePageBuilderStore(
    (state) => state.onUpdateNodeProperty
  );

  const handleTextContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempValue(e.target.value);
  };
  const handleOnBlur = () => {
    onUpdateNodeProperty({ [config.propKey]: tempValue }, config.context);
  };
  const handleClear = () => {
    onUpdateNodeProperty({ [config.propKey]: '' }, config.context);
    setTempValue('');
  };
  return (
    <FormField>
      <FormLabel className='block'>
        <span className='text-gray-700'>{config.label}:</span>
        <div className='flex items-stretch'>
          <Input
            name={config.propKey}
            value={(tempValue as string) || ''}
            onChange={handleTextContent}
          />
          <Button onClick={handleOnBlur}>
            <FontAwesomeIcon icon={faFloppyDisk} />
          </Button>
          <Button onClick={handleClear}>
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </div>
      </FormLabel>
    </FormField>
  );
}
export default AsInput;
