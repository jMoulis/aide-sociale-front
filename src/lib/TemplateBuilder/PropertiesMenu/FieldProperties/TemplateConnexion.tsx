import FormField from '@/components/form/FormField';
import { IFormField } from '../../interfaces';
import { useTemplateBuilder } from '../../TemplateBuilderContext';
import FormLabel from '@/components/form/FormLabel';
import { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { sortArray } from '@/lib/utils/utils';

type Props = {
  field: IFormField;
  blockId: string;
};
function TemplateConnexion({ field, blockId }: Props) {
  const { updateField, availableFields } = useTemplateBuilder();
  const t = useTranslations('TemplateSection');
  const handleUpdateField = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    updateField(blockId, field.id, 'connectedFieldId', value);
  };
  return (
    <div className='p-2'>
      <span>{t('availableFields')}</span>
      {sortArray(availableFields || [], 'label')?.map((availableField) => (
        <div key={availableField.id}>
          <FormField className='flex-row items-center'>
            <input
              type='radio'
              name='template'
              id={availableField.id}
              checked={field.connectedFieldId === availableField.name || false}
              value={availableField.name}
              onChange={handleUpdateField}
            />
            <FormLabel className='mb-0 ml-2'>{availableField.label}</FormLabel>
          </FormField>
        </div>
      ))}
    </div>
  );
}
export default TemplateConnexion;
