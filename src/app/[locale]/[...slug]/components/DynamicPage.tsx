'use client';

import client from '@/lib/mongo/initMongoClient';
import { IFormBlock, IFormTemplate } from '@/lib/TemplateBuilder/interfaces';
import { renderField } from '@/lib/TemplateBuilder/RenderFieldParams';
import { toastPromise } from '@/lib/toast/toastPromise';
import { removeObjectFields } from '@/lib/utils/utils';
import { useTranslations } from 'next-intl';
import { FormEvent, Fragment, useCallback, useState } from 'react';

type DynamicFormProps = {
  template: IFormTemplate | null;
  previousData?: any;
  documentId?: string;
  collectionName?: string;
  // onSubmit: (formData: IFormData) => void;
};

export default function DynamicForm({
  template,
  previousData,
  documentId,
  collectionName
}: // onSubmit,
// newVersionAvailable
DynamicFormProps) {
  const [formData, setFormData] = useState<any>(previousData || { data: {} });
  const t = useTranslations('GlobalSection');

  const handleChange = useCallback((fieldName: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      data: { ...prev.data, [fieldName]: value }
    }));
  }, []);

  const renderBlock = useCallback(
    (block: IFormBlock) => {
      let columns = 'grid-cols-1';
      if (block.layout === 'two-column') columns = 'grid-cols-2';
      if (block.layout === 'three-column') columns = 'grid-cols-3';
      return (
        <div key={block.id} className={`grid gap-2 mb-2 ${columns}`}>
          {block.fields.map((field) => (
            <Fragment key={field.id}>
              {renderField({
                field,
                formData,
                onChange: handleChange,
                setFormData
              })}
            </Fragment>
          ))}
        </div>
      );
    },
    [formData, handleChange]
  );

  const _handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (documentId && collectionName) {
      const dataWithoutId = removeObjectFields(formData.data, ['_id']);
      await toastPromise(
        client.update(
          collectionName as any,
          { _id: documentId },
          { $set: dataWithoutId }
        ),
        t,
        'edit'
      );
      return;
    }
    await toastPromise(
      client.create(collectionName as any, formData.data),
      t,
      'create'
    );
    // onSubmit(formData);
  };

  if (!template) return null;

  return (
    // <form onSubmit={handleSubmit} className='p-4 max-h-[85vh] overflow-auto'>
    <>
      {/* <div className='flex items-baseline mb-1'>
        <h1 className='text-2xl font-bold'>{template.title}</h1>
        <span className='text-xs ml-1 text-slate-500'>{`(v-${template.version})`}</span>
        {newVersionAvailable ? <RequiredFlag label='new' /> : null}
      </div> */}
      {template.blocks.map(renderBlock)}
      {/* <div>
        {Object.keys(formData.archivedData || {}).map((archivedKey) => {
          const archivedInfo = (formData.archivedData || {})[archivedKey];
          return (
            <div key={archivedKey} className='bg-gray-100 p-2 text-gray-600'>
              <h4>{archivedKey}</h4>
              <p className='text-sm italic'>{String(archivedInfo.value)}</p>
              <p className='text-xs text-red-500'>
                {archivedInfo.reason || 'Archived field'}
              </p>
            </div>
          );
        })}
      </div> */}
      {/* <FormFooterAction>
        <Button type='submit'>{t('actions.save')}</Button>
      </FormFooterAction> */}
    </>
    // </form>
  );
}
