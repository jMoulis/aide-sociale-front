import FormField from '@/components/form/FormField';
import { IFormField } from '../../interfaces';
import { useTemplateBuilder } from '../../TemplateBuilderContext';
import FormLabel from '@/components/form/FormLabel';
import { useTranslations } from 'next-intl';
import Selectbox from '@/components/form/Selectbox';
import DatabaseConnexion from './DatabaseConnexion';
import StaticDataOptions from './StaticDataOptions';
import { useMemo } from 'react';
import TemplateConnexion from './TemplateConnexion';

type Props = {
  field: IFormField;
  blockId: string;
};
function DataMenu({ field, blockId }: Props) {
  const { updateField, isEditable } = useTemplateBuilder();
  const t = useTranslations('TemplateSection');
  const optionsSourceTypes = useMemo(
    () => [
      {
        value: 'database',
        label: t('databaseOptions')
      },
      {
        value: 'static',
        label: t('staticOptions')
      },
      {
        value: 'template',
        label: t('template')
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div>
      <div className=''>
        <FormField className='block'>
          <FormLabel>{t('sourceOptions')}</FormLabel>
          <Selectbox
            name='optionsSourceType'
            value={field.optionsSourceType || 'static'}
            options={optionsSourceTypes}
            disabled={!isEditable}
            onChange={(e) =>
              updateField(
                blockId,
                field.id,
                'optionsSourceType',
                e.target.value
              )
            }
          />
        </FormField>
      </div>
      {field.optionsSourceType === 'database' ? (
        <DatabaseConnexion field={field} blockId={blockId} />
      ) : null}
      {field.optionsSourceType === 'static' ? (
        <StaticDataOptions field={field} blockId={blockId} />
      ) : null}
      {field.optionsSourceType === 'template' ? (
        <TemplateConnexion field={field} blockId={blockId} />
      ) : null}
    </div>
  );
}
export default DataMenu;
