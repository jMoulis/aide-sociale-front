'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import { createUser } from '../actions';
import Input from '@/components/form/Input';
import { useToast } from '@/lib/hooks/use-toast';
import useClerkErrorLocalization from '@/lib/hooks/useClerkErrorLocalization';
import Dialog from '@/components/dialog/Dialog';
import Form from '@/components/form/Form';
import InputPassword from '@/components/form/InputPassword';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import Button from '@/components/buttons/Button';
import CancelButton from '@/components/buttons/CancelButton';

type Props = {
  onSuccess?: () => void;
};
function CreateUser({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('UserSection');
  const tGlobal = useTranslations('GlobalSection');
  const tError = useTranslations('ErrorSection.errorSecurity');
  const tSecurity = useTranslations('SecuritySection');
  const tProfile = useTranslations('ProfileSection');
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const { onCatchErrors } = useClerkErrorLocalization();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    try {
      const firstName = (
        form.elements.namedItem('firstName') as HTMLInputElement | null
      )?.value;
      const lastName = (
        form.elements.namedItem('lastName') as HTMLInputElement | null
      )?.value;
      const email = (
        form.elements.namedItem('email') as HTMLInputElement | null
      )?.value;
      const password = (
        form.elements.namedItem('password') as HTMLInputElement | null
      )?.value;
      const confirmPassword = (
        form.elements.namedItem('confirmPassword') as HTMLInputElement | null
      )?.value;

      if (!email || !password || !firstName || !lastName) {
        toast({
          title: tError('missingFields.title'),
          description: tError('missingFields.description'),
          variant: 'destructive'
        });
        return;
      }
      if (password !== confirmPassword) {
        toast({
          title: tError('passwordMismatched.title'),
          description: tError('passwordMismatched.description'),
          variant: 'destructive'
        });
        return;
      }
      setSaving(true);
      const response = await createUser({
        firstName,
        lastName,
        email,
        password
      });
      setSaving(false);
      if (!response.isError) {
        setOpen(false);
        onSuccess?.();
      } else {
        toast(response as any);
      }
    } catch (error: any) {
      setSaving(false);
      const translatedErrors = onCatchErrors(error);
      toast({
        title: tError('title'),
        description: (
          <ul>
            {translatedErrors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        ),
        variant: 'destructive'
      });
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        // top='!top-[30%]'
        open={open}
        title={t('create.title')}
        onOpenChange={setOpen}
        Trigger={<Button>{t('create.action')}</Button>}>
        {open ? (
          <Form onSubmit={handleSubmit}>
            <div className='flex space-x-2'>
              <FormField>
                <FormLabel htmlFor='firstName'>
                  {tProfile('firstName')}
                </FormLabel>
                <Input id='firstName' name='firstName' />
              </FormField>
              <FormField>
                <FormLabel htmlFor='lastName'>{tProfile('lastName')}</FormLabel>
                <Input id='lastName' name='lastName' />
              </FormField>
            </div>
            <FormField>
              <FormLabel htmlFor='email'>{tProfile('email')}</FormLabel>
              <Input id='email' name='email' type='email' required />
            </FormField>
            <FormField>
              <FormLabel htmlFor='password'>{tSecurity('password')}</FormLabel>
              <InputPassword id='password' name='password' />
            </FormField>
            <FormField>
              <FormLabel htmlFor='confirmPassword'>
                {tSecurity('confirmPassword')}
              </FormLabel>
              <InputPassword id='confirmPassword' name='confirmPassword' />
            </FormField>
            <FormFooterAction>
              <Button loading={saving} type='submit' disabled={saving}>
                {t('create.action')}
              </Button>
              <CancelButton
                type='reset'
                disabled={saving}
                onClick={handleCancel}>
                {tGlobal('actions.cancel')}
              </CancelButton>
            </FormFooterAction>
          </Form>
        ) : null}
      </Dialog>
    </div>
  );
}
export default CreateUser;
