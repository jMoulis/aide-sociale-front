import SaveButton from '@/components/buttons/SaveButton';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import Form from '@/components/form/Form';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import { IEmployee } from '@/lib/interfaces/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { toastPromise } from '@/lib/toast/toastPromise';
import { useTranslations } from 'next-intl';
import { ChangeEvent, FormEvent, useState } from 'react';

type Props = {
  initialEmployee: IEmployee;
};
function EmployeeForm({ initialEmployee }: Props) {
  const t = useTranslations('UserSection');

  const [employee, setEmployee] = useState<IEmployee>(initialEmployee);
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await toastPromise(
      client.create(ENUM_COLLECTIONS.USERS, employee),
      t,
      'create'
    );
  };
  return (
    <Form onSubmit={handleSubmit}>
      <FormField>
        <FormLabel required>{t('labels.firstName')}</FormLabel>
        <Input
          type='text'
          name='firstName'
          value={employee.firstName}
          onChange={handleInputChange}
        />
      </FormField>
      <FormField>
        <FormLabel required>{t('labels.lastName')}</FormLabel>
        <Input
          name='lastName'
          value={employee.lastName}
          onChange={handleInputChange}
        />
      </FormField>
      <FormFooterAction>
        <SaveButton />
      </FormFooterAction>
    </Form>
  );
}
export default EmployeeForm;
