'use client';

import Button from '@/components/buttons/Button';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import Form from '@/components/form/Form';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import Textarea from '@/components/form/Textarea';
import { IStructure } from '@/lib/interfaces/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { toastPromise } from '@/lib/toast/toastPromise';
import { removeObjectFields } from '@/lib/utils/utils';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { v4 } from 'uuid';

type Props = {
  prevStructure: IStructure | null;
  organizationId: string;
};
function StructureForm({ prevStructure, organizationId }: Props) {
  const defaultStructure: IStructure = {
    _id: v4(),
    name: '',
    description: '',
    type: 'family',
    createdAt: new Date(),
    modifications: [],
    organizationId,
    capacity: 0,
    occupancy: 0,
    departmentId: '',
    tasks: [],
    placements: []
  };
  const [structure, setStructure] = useState<IStructure>(
    prevStructure || defaultStructure
  );
  const t = useTranslations('StructureSection');
  const tGlobal = useTranslations('GlobalSection');
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setStructure((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (prevStructure) {
      await toastPromise(
        client.update(
          ENUM_COLLECTIONS.STRUCTURES,
          { _id: prevStructure._id },
          { $set: removeObjectFields(structure, ['_id']) }
        ),
        t,
        'edit'
      );
    } else {
      await toastPromise(
        client.create(ENUM_COLLECTIONS.STRUCTURES, structure),
        t,
        'create'
      );
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      <FormField>
        <FormLabel required>{t('labels.name')}</FormLabel>
        <Input
          name='name'
          required
          value={structure.name}
          onChange={handleInputChange}
        />
      </FormField>
      <FormField>
        <FormLabel>{t('labels.description')}</FormLabel>
        <Textarea
          name='description'
          value={structure.description}
          onChange={handleInputChange}
        />
      </FormField>
      <FormField>
        <FormLabel required>{t('labels.capacity')}</FormLabel>
        <Input
          required
          type='number'
          name='capacity'
          value={structure.capacity}
          onChange={handleInputChange}
        />
      </FormField>
      <FormFooterAction>
        <Button type='submit'>
          {tGlobal(prevStructure ? 'actions.update' : 'actions.create')}
        </Button>
      </FormFooterAction>
    </Form>
  );
}
export default StructureForm;
