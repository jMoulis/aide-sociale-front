'use client';

import { useTranslations } from 'next-intl';
import { FormEvent, useState } from 'react';
import { useToast } from '@/lib/hooks/use-toast';
import FormField from '@/components/form/FormField';
import Button from '@/components/buttons/Button';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import Form from '@/components/form/Form';
import ImageUpload from '@/components/form/ImageUpload/ImageUpload';
import { useUser } from '@clerk/nextjs';
import useForm from '@/lib/hooks/useForm';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { IUser } from '@/lib/interfaces/interfaces';

type Props = {
  userServer: {
    id?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string | null;
  } | null;
};

function ProfileForm({ userServer }: Props) {
  const { user } = useUser();
  const t = useTranslations('ProfileSection');
  const tGlobal = useTranslations('GlobalSection');
  const tError = useTranslations('ErrorSection');
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const { getValidInputsValue } = useForm();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formId = event.currentTarget.id;
    if (formId !== 'profile-form') return;
    if (!userServer?.id) return;

    try {
      setSaving(true);
      const inputsValue = getValidInputsValue(
        event.currentTarget as HTMLFormElement,
        ['firstName', 'lastName'] as const
      );
      await user?.update(inputsValue);

      await client.update<IUser>(
        ENUM_COLLECTIONS.USERS,
        {
          authId: userServer.id
        },
        {
          $set: {
            ...inputsValue
          }
        }
      );
      user?.reload();
      setSaving(false);
      toast({
        title: tGlobal('success'),
        description: tGlobal('actions.save'),
        variant: 'success'
      });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'default' });
    }
  };

  const handleUploadFile = async (file: File) => {
    try {
      await user?.setProfileImage({
        file
      });
      user?.reload();
    } catch (error: any) {
      toast({
        title: tError('errorUploadFileSelect.title'),
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  return (
    <>
      <h1>{t('title')}</h1>
      <FormField>
        <ImageUpload
          name='imageUrl'
          id='imageUrl'
          imageUrl={userServer?.imageUrl || ''}
          onUpload={handleUploadFile}
        />
      </FormField>
      <Form id='profile-form' onSubmit={handleSubmit}>
        <FormField>
          <FormLabel htmlFor='lastName'>{t('lastName')}</FormLabel>
          <Input
            type='text'
            name='lastName'
            id='lastName'
            placeholder='lastName'
            defaultValue={userServer?.lastName || ''}
          />
        </FormField>
        <FormField>
          <FormLabel htmlFor='firstName'>{t('firstName')}</FormLabel>
          <Input
            type='text'
            name='firstName'
            id='firstName'
            placeholder='firstName'
            defaultValue={userServer?.firstName || ''}
          />
        </FormField>
        <Button type='submit' loading={saving}>
          {tGlobal('actions.save')}
        </Button>
      </Form>
    </>
  );
}
export default ProfileForm;
