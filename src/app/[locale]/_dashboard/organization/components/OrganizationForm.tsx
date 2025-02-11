'use client';

import SaveButton from '@/components/buttons/SaveButton';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import Form from '@/components/form/Form';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import Selectbox, { SelectboxEvent } from '@/components/form/Selectbox';
import { frechDepartments } from '@/lib/datas/departements';
import { IOrganization } from '@/lib/interfaces/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { toastPromise } from '@/lib/toast/toastPromise';
import { removeObjectFields } from '@/lib/utils/utils';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';

type Props = {
  prevOrganization: IOrganization | null;
  onSubmit?: (organizationId: string) => void;
};

function OrganizationForm({ prevOrganization, onSubmit }: Props) {
  const t = useTranslations('OrganizationSection');
  const [form, setForm] = useState<IOrganization>(
    prevOrganization || {
      _id: nanoid(),
      name: '',
      structures: [],
      department: '',
      createdAt: new Date(),
      modifications: [],
      addresses: [],
      contactsInfo: []
    }
  );
  useEffect(() => {
    if (prevOrganization) {
      setForm(prevOrganization);
    }
  }, [prevOrganization]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | SelectboxEvent
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (prevOrganization) {
      await toastPromise(
        client.update(
          ENUM_COLLECTIONS.ORGANIZATIONS,
          { _id: prevOrganization._id },
          { $set: removeObjectFields(form, ['_id']) }
        ),
        t,
        'edit'
      );
    } else {
      await toastPromise(
        client.create(ENUM_COLLECTIONS.ORGANIZATIONS, form),
        t,
        'create'
      );
    }
    onSubmit?.(form._id);
  };
  return (
    <Form onSubmit={handleSubmit}>
      <FormField>
        <FormLabel required>{t('labels.name')}</FormLabel>
        <Input
          name='name'
          onChange={handleInputChange}
          value={form.name}
          required
        />
      </FormField>
      <FormField>
        <FormLabel required>{t('labels.department')}</FormLabel>
        <Selectbox
          name='department'
          options={frechDepartments}
          required
          onChange={handleInputChange}
          value={form.department}
        />
      </FormField>
      <FormFooterAction>
        <SaveButton type='submit'>
          {t(prevOrganization ? 'edit.action' : 'create.action')}
        </SaveButton>
      </FormFooterAction>
    </Form>
  );
}
export default OrganizationForm;
