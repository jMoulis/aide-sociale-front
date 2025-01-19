import FormField from '@/components/form/FormField';
import { IFormField } from '../../interfaces';
import { useTemplateBuilder } from '../../TemplateBuilderContext';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import { useTranslations } from 'next-intl';
import Button from '@/components/buttons/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { Checkbox } from '@/components/ui/checkbox';
import Data from './DataMenu';
import { fieldTypes } from '../../fieldTypes';
import { useMemo } from 'react';
import Textarea from '@/components/form/Textarea';

type Props = {
  blockId: string;
  field: IFormField;
};
export default function FieldPropertiesEditor({ blockId, field }: Props) {
  const { updateField, deleteField, isEditable } = useTemplateBuilder();
  const t = useTranslations('TemplateSection');
  const fieldType = useMemo(
    () => fieldTypes.find((ft) => ft.value === field.type),
    [field.type]
  );
  return (
    <div className='p-4 space-y-2'>
      <h2>{t('fieldProperties')}</h2>
      {fieldType ? (
        <div className='flex-1 grid items-center grid-cols-[20px_1fr] gap-1'>
          <FontAwesomeIcon icon={fieldType.icon} />
          <span className='text-sm text-left'>{fieldType.label}</span>
        </div>
      ) : null}
      <FormField>
        <FormLabel required>{t('label')}</FormLabel>
        <Input
          required
          type='text'
          placeholder={t('label')}
          className='border p-1'
          value={field.label}
          disabled={!isEditable}
          onChange={(e) =>
            updateField(blockId, field.id, 'label', e.target.value)
          }
        />
        <span className='text-gray-500 text-xs'>#{field.name}</span>
      </FormField>
      <FormField>
        <FormLabel>{t('description')}</FormLabel>
        <Textarea
          className='border p-1 w-full'
          placeholder={t('description')}
          value={field.description || ''}
          disabled={!isEditable}
          onChange={(e) =>
            updateField(blockId, field.id, 'description', e.target.value)
          }
        />
      </FormField>
      <FormField>
        <FormLabel>{t('placeholder')}</FormLabel>
        <Input
          className='border p-1 w-full'
          placeholder={t('placeholder')}
          value={field.placeholder || ''}
          disabled={!isEditable}
          onChange={(e) =>
            updateField(blockId, field.id, 'placeholder', e.target.value)
          }
        />
      </FormField>
      <FormField className='flex-row items-center'>
        <Checkbox
          id={field.id}
          onCheckedChange={(checked) =>
            updateField(blockId, field.id, 'required', checked)
          }
          onClick={(e) => e.stopPropagation()}
          checked={field.required || false}
          disabled={!isEditable}
        />
        <FormLabel className='mb-0 ml-2' htmlFor={field.id}>
          {t('required')}
        </FormLabel>
      </FormField>
      <Data field={field} blockId={blockId} />
      {isEditable ? (
        <Button
          className='text-red-500'
          onClick={() => deleteField(blockId, field.id)}>
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      ) : null}
    </div>
  );
}
