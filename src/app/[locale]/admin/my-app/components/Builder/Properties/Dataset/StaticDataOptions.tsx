import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import { useTranslations } from 'next-intl';
import Button from '@/components/buttons/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { usePageBuilderStore } from '../../../stores/pagebuilder-store-provider';
import { ElementConfigProps, IVDOMNode } from '../../../interfaces';
import { useState } from 'react';
import { IDataset } from '@/lib/interfaces/interfaces';

type Props = {
  config: ElementConfigProps;
  selectedNode: IVDOMNode | null;
};

function StaticDataOptions({ config, selectedNode }: Props) {
  const onUpdateNodeProperty = usePageBuilderStore(
    (state) => state.onUpdateNodeProperty
  );

  const [options, setOptions] = useState<string[]>(
    selectedNode?.context?.dataset?.connexion?.staticDataOptions || []
  );

  const t = useTranslations('TemplateSection');

  const handleAddOption = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.currentTarget.value.trim()) {
      const option = event.currentTarget.value.trim();
      const updateOptions = (prev: string[], newOption: string) => {
        if (prev.includes(newOption)) {
          return prev;
        }
        return [...prev, newOption];
      };
      const updatedOptions = updateOptions(options, option);
      setOptions(updatedOptions);
      onUpdateNodeProperty(
        {
          dataset: {
            ...selectedNode?.context?.dataset,
            connexion: {
              ...selectedNode?.context?.dataset?.connexion,
              staticDataOptions: updatedOptions
            }
          }
        } as Partial<IDataset>,
        config.context
      );
      event.currentTarget.value = '';
    }
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = options.filter((_, optIndex) => optIndex !== index);
    setOptions(updatedOptions);
    onUpdateNodeProperty(
      {
        dataset: {
          ...selectedNode?.context?.dataset,
          connexion: {
            ...selectedNode?.context?.dataset?.connexion,
            staticDataOptions: updatedOptions
          }
        }
      },
      config.context
    );
  };
  return (
    <div>
      <FormLabel>{t('staticOptions')}</FormLabel>
      {options.map((option, optIndex) => (
        <div key={optIndex} className='flex items-center space-x-2 mb-2'>
          <Button
            className='text-red-500'
            // disabled={!isEditable}
            onClick={() => handleRemoveOption(optIndex)}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
          <span className='text-sm w-52'>{option}</span>
        </div>
      ))}
      <FormField className='flex mt-2'>
        <Input
          type='text'
          placeholder={t('newOption')}
          // disabled={!isEditable}
          onKeyDown={handleAddOption}
        />
      </FormField>
    </div>
  );
}
export default StaticDataOptions;
