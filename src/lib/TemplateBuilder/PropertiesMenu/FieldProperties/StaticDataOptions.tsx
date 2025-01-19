import FormField from '@/components/form/FormField';
import { IFormField } from '../../interfaces';
import { useTemplateBuilder } from '../../TemplateBuilderContext';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import { useTranslations } from 'next-intl';
import Button from '@/components/buttons/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';

type Props = {
  field: IFormField;
  blockId: string;
};
function StaticDataOptions({ field, blockId }: Props) {
  const { removeOptionFromField, addOptionToField, isEditable } =
    useTemplateBuilder();
  const t = useTranslations('TemplateSection');

  return (
    <div>
      <FormLabel>{t('staticOptions')}</FormLabel>
      {field.options?.map((option, optIndex) => (
        <div key={optIndex} className='flex items-center space-x-2 mb-2'>
          <Button
            className='text-red-500'
            disabled={!isEditable}
            onClick={() => removeOptionFromField(blockId, field.id, optIndex)}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
          <span className='text-sm w-52'>{option}</span>
        </div>
      ))}
      <FormField className='flex mt-2'>
        <Input
          type='text'
          placeholder={t('newOption')}
          disabled={!isEditable}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              addOptionToField(blockId, field.id, e.currentTarget.value.trim());
              e.currentTarget.value = '';
            }
          }}
        />
      </FormField>
    </div>
  );
}
export default StaticDataOptions;
