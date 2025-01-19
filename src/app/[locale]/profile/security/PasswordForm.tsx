'use client';

import { useUser } from '@clerk/nextjs';
import { useTranslations } from 'next-intl';
import { FormEvent, useMemo, useState } from 'react';
import { useToast } from '@/lib/hooks/use-toast';
import Form from '@/components/form/Form';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Button from '@/components/buttons/Button';
import useClerkErrorLocalization from '@/lib/hooks/useClerkErrorLocalization';
import InputPassword from '@/components/form/InputPassword';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import CancelButton from '@/components/buttons/CancelButton';

function PasswordForm() {
  const { user } = useUser();
  const t = useTranslations('SecuritySection');
  const tGlobal = useTranslations('GlobalSection');
  const tError = useTranslations('ErrorSection.errorSecurity');
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const { onCatchErrors } = useClerkErrorLocalization();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'User not found',
        variant: 'destructive'
      });
      return;
    }
    try {
      const currentPasswordInputValue = form.elements.namedItem(
        'currentPassword'
      ) as HTMLInputElement | null;
      const newPasswordInputValue = form.elements.namedItem(
        'newPassword'
      ) as HTMLInputElement | null;
      const confirmPasswordInputValue = form.elements.namedItem(
        'confirmPassword'
      ) as HTMLInputElement | null;
      if (
        !newPasswordInputValue?.value ||
        !confirmPasswordInputValue?.value ||
        !currentPasswordInputValue?.value
      ) {
        toast({
          title: tError('missingFields.title'),
          description: tError('missingFields.description'),
          variant: 'destructive'
        });
        return;
      }
      if (newPasswordInputValue.value !== confirmPasswordInputValue.value) {
        toast({
          title: tError('passwordMismatched.title'),
          description: tError('passwordMismatched.description'),
          variant: 'destructive'
        });
        return;
      }
      setSaving(true);
      await user?.updatePassword({
        newPassword: newPasswordInputValue.value,
        currentPassword: currentPasswordInputValue?.value,
        signOutOfOtherSessions: true
      });

      toast({
        title: t('title'),
        description: t('saveSuccess'),
        variant: 'success'
      });
      form.reset();
      setSaving(false);
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

  const passwordFormFields = useMemo(() => {
    return [
      {
        id: 'currentPassword',
        name: 'currentPassword',
        required: true,
        placeholder: t('currentPassword')
      },
      {
        id: 'newPassword',
        name: 'newPassword',
        required: true,
        placeholder: t('newPassword')
      },
      {
        id: 'confirmPassword',
        name: 'confirmPassword',
        required: true,
        placeholder: t('confirmPassword')
      }
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form onSubmit={handleSubmit}>
      {passwordFormFields.map((field) => (
        <FormField key={field.name}>
          <FormLabel required={field.required}>
            {t(`${field.name}` as any)}
          </FormLabel>
          <InputPassword {...field} />
        </FormField>
      ))}
      <FormFooterAction>
        <Button loading={saving} type='submit' disabled={saving}>
          {tGlobal('actions.update')}
        </Button>
        <CancelButton type='reset' disabled={saving}>
          {tGlobal('actions.cancel')}
        </CancelButton>
      </FormFooterAction>
    </Form>
  );
}
export default PasswordForm;
