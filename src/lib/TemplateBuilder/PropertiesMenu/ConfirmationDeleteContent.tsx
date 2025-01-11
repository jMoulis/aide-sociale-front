import { useTranslations } from 'next-intl';
import DiffConsultation from './DiffConsultation/DiffConsultation';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import { ChangeEvent } from 'react';

type Props = {
  relatedDocumentsLength: number;
  confirmationStringPattern: string;
  onConfirmStringChange: (event: ChangeEvent<HTMLInputElement>) => void;
  confirmString: string;
};
const ConfirmationDeleteContent = ({
  relatedDocumentsLength,
  confirmationStringPattern,
  onConfirmStringChange,
  confirmString
}: Props) => {
  const t = useTranslations('TemplateSection');

  return (
    <div className='space-y-2'>
      {relatedDocumentsLength ? (
        <div className='p-2 rounded-md bg-gray-100'>
          <p className='whitespace-pre-wrap text-sm'>
            {t('relatedDocuments.warningRelatedDocuments', {
              relatedDocumentsLength: relatedDocumentsLength
            })}
          </p>
          <DiffConsultation />
        </div>
      ) : null}
      <FormField>
        <FormLabel htmlFor='delete'>
          {t.rich('delete.toConfirm', {
            templateName: confirmationStringPattern,
            code: (chunks) => (
              <code className='bg-slate-100 rounded px-1'>{chunks}</code>
            )
          })}
        </FormLabel>
        <Input
          id='delete'
          required
          onChange={onConfirmStringChange}
          value={confirmString}
          pattern={confirmationStringPattern}
        />
      </FormField>
    </div>
  );
};
export default ConfirmationDeleteContent;
