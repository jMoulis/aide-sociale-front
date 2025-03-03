import Dialog from '@/components/dialog/Dialog';
import { ICollectionField } from '@/lib/interfaces/interfaces';
import { JSX, useState } from 'react';
import ValidationConfigBuilder from './ValidationConfigBuilder/ValidationConfigBuilder';
import { useTranslations } from 'next-intl';

type Props = {
  fields: ICollectionField[];
  onUpsertFields: (fields: ICollectionField[], schema: string) => void;
  Trigger: JSX.Element;
};
function FieldDialogForm({ fields, onUpsertFields, Trigger }: Props) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('CollectionSection.propertyEditor');
  const handleSubmit = (schema: string, fields: ICollectionField[]) => {
    onUpsertFields(fields, schema);
    setOpen(false);
  };

  return (
    <div className='flex'>
      <Dialog
        open={open}
        contentStyle={{
          display: 'flex',
          flexDirection: 'column',
          height: '90vh',
          width: '90vw',
          maxWidth: 'none',
          maxHeight: 'none',
          overflow: 'auto'
        }}
        title={t('labels.fieldsConfiguration')}
        onOpenChange={setOpen}
        Trigger={Trigger}>
        <ValidationConfigBuilder prevFields={fields} onSave={handleSubmit} />
      </Dialog>
    </div>
  );
}
export default FieldDialogForm;
