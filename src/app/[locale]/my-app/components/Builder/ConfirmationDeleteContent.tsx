import { useTranslations } from 'next-intl';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import React, { ChangeEvent } from 'react';

type Props = {
  confirmationStringPattern: string;
  onConfirmStringChange: (event: ChangeEvent<HTMLInputElement>) => void;
  confirmString: string;
  children?: React.ReactNode;
};
const ConfirmationDeleteContent = ({
  confirmationStringPattern,
  onConfirmStringChange,
  confirmString,
  children
}: Props) => {
  const t = useTranslations('TemplateSection');

  return (
    <div className='space-y-2'>
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
      {children}
    </div>
  );
};
export default ConfirmationDeleteContent;
