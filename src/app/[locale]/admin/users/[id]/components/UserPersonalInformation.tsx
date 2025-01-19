'use client';

import Form from '@/components/form/Form';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import { useTranslations } from 'next-intl';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import Button from '@/components/buttons/Button';
import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import useForm from '@/lib/hooks/useForm';
import { updateUser } from '../../actions';

import CancelButton from '@/components/buttons/CancelButton';
import { UserExcerpt } from '@/lib/interfaces/interfaces';
import { toast } from '@/lib/hooks/use-toast';

type Props = {
  user: UserExcerpt;
  onUpdateUser: Dispatch<SetStateAction<UserExcerpt>>;
};

function UserPersonalInformation({ user, onUpdateUser }: Props) {
  const t = useTranslations('ProfileSection');
  const tGlobal = useTranslations('GlobalSection');
  const { getValidInputsValue } = useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const inputValues = getValidInputsValue(
      event.currentTarget as HTMLFormElement,
      ['firstName', 'lastName'] as const
    );

    try {
      setLoading(true);
      const response = await updateUser(user.id, inputValues);
      if (response.isError) {
        toast({
          title: response.title,
          description: response.description,
          variant: 'destructive'
        });
      } else {
        toast({
          title: response.title,
          description: response.description,
          variant: 'success'
        });
      }
      setLoading(false);
      onUpdateUser((prev) => ({
        ...prev,
        firstName: inputValues.firstName,
        lastName: inputValues.lastName
      }));
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormField>
        <FormLabel htmlFor='firstName'>{t('firstName')}</FormLabel>
        <Input
          id='firstName'
          name='firstName'
          defaultValue={user.firstName || ''}
        />
      </FormField>
      <FormField>
        <FormLabel htmlFor='lastName'>{t('lastName')}</FormLabel>
        <Input
          id='lastName'
          name='lastName'
          defaultValue={user.lastName || ''}
        />
      </FormField>
      <FormFooterAction>
        <Button type='submit' loading={loading} disabled={loading}>
          {tGlobal('actions.save')}
        </Button>
        <CancelButton type='button' disabled={loading}>
          {tGlobal('actions.cancel')}
        </CancelButton>
      </FormFooterAction>
    </Form>
  );
}

export default UserPersonalInformation;
