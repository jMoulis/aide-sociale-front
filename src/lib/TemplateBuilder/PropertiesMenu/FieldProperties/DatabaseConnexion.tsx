import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import { IFormField } from '../../interfaces';
import { useTemplateBuilder } from '../../TemplateBuilderContext';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Selectbox from '@/components/form/Selectbox';

type Props = {
  field: IFormField;
  blockId: string;
};
function DatabaseConnexion({ field, blockId }: Props) {
  const { updateField, isEditable, selectedCollection } = useTemplateBuilder();
  const t = useTranslations('TemplateSection');
  const availableCollectionFields = useMemo<string[]>(
    () => selectedCollection?.fields || [],
    [selectedCollection]
  );
  return (
    <div className='space-y-2'>
      <FormField>
        <FormLabel htmlFor='label'>{t('labelField')}</FormLabel>
        <Selectbox
          name='label'
          value={field.labelField}
          disabled={!isEditable}
          options={availableCollectionFields.map((field) => ({
            label: field,
            value: field
          }))}
          onChange={(e) =>
            updateField(blockId, field.id, 'labelField', e.target.value)
          }
        />
      </FormField>
    </div>
  );
}
export default DatabaseConnexion;
