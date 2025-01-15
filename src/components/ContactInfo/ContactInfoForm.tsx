import { IContactInfo } from '@/lib/interfaces/interfaces';
import { useEffect, useState } from 'react';
import Form from '../form/Form';
import FormField from '../form/FormField';
import FormLabel from '../form/FormLabel';
import Input from '../form/Input';
import FormFooterAction from '../dialog/FormFooterAction';
import Button from '../buttons/Button';
import { useTranslations } from 'next-intl';
import Selectbox, { SelectboxEvent } from '../form/Selectbox';
import DeleteButton from '../buttons/DeleteButton';

type Props = {
  prevContactInfo: IContactInfo;
  onSubmit: (contactInfo: IContactInfo) => void;
  onDelete: (contactInfo: IContactInfo) => void;
};

function ContactInfoForm({ prevContactInfo, onSubmit, onDelete }: Props) {
  const tGlobal = useTranslations('GlobalSection.actions');
  const t = useTranslations('ContactInfoSection');
  const [contactInfo, setContactInfo] = useState<IContactInfo>(prevContactInfo);

  const typeInputPattern: {
    [key: string]: { pattern: string; tooltipPattern: string };
  } = {
    phone: {
      pattern: '^[0-9]{10,15}$',
      tooltipPattern: t('tooltips.phone')
    },
    email: {
      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$',
      tooltipPattern: t('tooltips.email')
    },
    website: {
      pattern: '^(http|https)://[^ "]+$',
      tooltipPattern: t('tooltips.website')
    }
  };

  useEffect(() => {
    if (prevContactInfo) {
      setContactInfo(prevContactInfo);
    }
  }, [prevContactInfo]);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | SelectboxEvent
  ) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(contactInfo);
  };
  return (
    <Form onSubmit={handleSubmit}>
      <FormField>
        <FormLabel required>{t('labels.label')}</FormLabel>
        <Input
          required
          name='label'
          value={contactInfo.label}
          onChange={handleInputChange}
        />
      </FormField>
      <FormField>
        <FormLabel required>{t('labels.type')}</FormLabel>
        <Selectbox
          required
          name='type'
          value={contactInfo.type}
          onChange={handleInputChange}
          options={[
            { value: 'phone', label: t('labels.phone') },
            { value: 'email', label: t('labels.email') },
            { value: 'website', label: t('labels.website') },
            { value: 'social', label: t('labels.social') }
          ]}
        />
      </FormField>
      <FormField>
        <FormLabel required>{t('labels.value')}</FormLabel>
        <Input
          type={contactInfo.type === 'email' ? 'email' : 'text'}
          required
          name='value'
          value={contactInfo.value}
          onChange={handleInputChange}
          pattern={typeInputPattern[contactInfo.type]?.pattern}
        />
        <span className='text-xs text-gray-500'>
          {typeInputPattern[contactInfo.type]?.tooltipPattern}
        </span>
      </FormField>

      <FormFooterAction>
        <Button type='submit'>{tGlobal('save')}</Button>
        <DeleteButton onClick={() => onDelete(contactInfo)} />
      </FormFooterAction>
    </Form>
  );
}
export default ContactInfoForm;
