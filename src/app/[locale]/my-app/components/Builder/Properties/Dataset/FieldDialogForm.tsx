import CancelButton from '@/components/buttons/CancelButton';
import DeleteButton from '@/components/buttons/DeleteButton';
import SaveButton from '@/components/buttons/SaveButton';
import Dialog from '@/components/dialog/Dialog';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import Form from '@/components/form/Form';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import { ICollectionField } from '@/lib/interfaces/interfaces';
import { slugifyFunction } from '@/lib/utils/utils';
import { faTrash } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import { ChangeEvent, FormEvent, JSX, useEffect, useState } from 'react';

type Props = {
  field: ICollectionField;
  onUpsertField: (field: ICollectionField) => void;
  Trigger: JSX.Element;
  onDeleteField?: (field: ICollectionField) => void;
};
function FieldDialogForm({
  field,
  onUpsertField,
  Trigger,
  onDeleteField
}: Props) {
  const [open, setOpen] = useState(false);
  const [fieldValue, setFieldValue] = useState<ICollectionField | null>(field);
  const t = useTranslations('CollectionSection');

  useEffect(() => {
    setFieldValue(field);
  }, [field]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFieldValue(
      (prev) =>
        ({
          ...prev,
          [name]: value,
          key: prev?.new ? slugifyFunction(value) : prev?.key
        } as ICollectionField)
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fieldValue) return;
    onUpsertField(fieldValue);
    setFieldValue(null);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <div className='flex'>
      <Dialog open={open} onOpenChange={setOpen} Trigger={Trigger}>
        <Form onSubmit={handleSubmit}>
          <FormField>
            <FormLabel>{t('labels.fields')}</FormLabel>
            <div className='relative'>
              <Input
                name='label'
                value={fieldValue?.label || ''}
                onChange={handleInputChange}
              />
              <span className='absolute rounded rounded-bl-none rounded-tl-none flex items-center right-[1px] top-[1px] bottom-[1px] px-1 bg-gray-100 text-gray-500 text-xs'>
                {fieldValue?.key}
              </span>
            </div>
          </FormField>
          <FormFooterAction>
            <SaveButton />
            <CancelButton onClick={handleCancel} />
          </FormFooterAction>
        </Form>
      </Dialog>
      {typeof onDeleteField === 'function' ? (
        <DeleteButton onClick={() => onDeleteField(field)}>
          <FontAwesomeIcon icon={faTrash} />
        </DeleteButton>
      ) : null}
    </div>
  );
}
export default FieldDialogForm;
