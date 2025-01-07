'use client';

import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import Selectbox, { SelectboxEvent } from '@/components/form/Selectbox';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { frechDepartments } from '@/lib/datas/departements';
import { IOrganization } from '@/lib/interfaces/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { v4 } from 'uuid';

type Props = {
  prevOrganization?: IOrganization;
};

function OrganizationForm({}: Props) {
  const t = useTranslations('OrganizationSection');
  const [form, setForm] = useState<IOrganization>({
    _id: v4(),
    name: '',
    structures: [],
    department: '',
    createdAt: new Date(),
    modifications: []
  });
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | SelectboxEvent
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const [open, setOpen] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await client.create(ENUM_COLLECTIONS.ORGANIZATIONS, {}, form);
      setOpen(false);
    } catch (error) {}
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>{t('create.title')}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('create.title')}</DialogTitle>
            <DialogDescription>{t('create.description')}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <FormField>
              <FormLabel required>{t('create.labels.name')}</FormLabel>
              <Input
                name='name'
                onChange={handleInputChange}
                value={form.name}
                required
              />
            </FormField>
            <FormField>
              <FormLabel required>{t('create.labels.department')}</FormLabel>
              <Selectbox
                name='department'
                options={frechDepartments}
                required
                onChange={handleInputChange}
                value={form.department}
              />
            </FormField>
            <Button type='submit'>{t('create.submit')}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default OrganizationForm;
