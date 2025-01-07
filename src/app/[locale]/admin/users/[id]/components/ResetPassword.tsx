'use client';

import Dialog from '@/components/dialog/Dialog';
import Form from '@/components/form/Form';
import { FormEvent, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useToast } from '@/lib/hooks/use-toast';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Button from '@/components/buttons/Button';
import useClerkErrorLocalization from '@/lib/hooks/useClerkErrorLocalization';
import { updateUserPassword } from '../../actions';

import FormFooterAction from '@/components/dialog/FormFooterAction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import CancelButton from '@/components/buttons/CancelButton';
import InputPassword from '@/components/form/InputPassword';

type Props = {
  userId: string;
};
function ResetPassword({ userId }: Props) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('SecuritySection');
  const tGlobal = useTranslations('GlobalSection');
  const tError = useTranslations('ErrorSection.errorSecurity');
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const { onCatchErrors } = useClerkErrorLocalization();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    if (!userId) {
      toast({
        title: 'Error',
        description: 'User not found',
        variant: 'destructive'
      });
      return;
    }
    try {
      const newPasswordInputValue = form.elements.namedItem(
        'newPassword'
      ) as HTMLInputElement | null;
      const confirmPasswordInputValue = form.elements.namedItem(
        'confirmPassword'
      ) as HTMLInputElement | null;
      if (!newPasswordInputValue?.value || !confirmPasswordInputValue?.value) {
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
      const response = await updateUserPassword(
        userId,
        newPasswordInputValue.value
      );
      toast({
        title: response.title,
        description: response.description,
        variant: response.isError ? 'destructive' : 'success'
      });
      if (!response.isError) {
        form.reset();
      }
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
  }, [userId]);

  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        Trigger={
          <Button className='flex items-center w-full'>
            <FontAwesomeIcon icon={faLock} className='mr-2' />
            <span className='text-xs whitespace-nowrap'>
              {t('changePassword')}
            </span>
          </Button>
        }>
        <div>
          <h2>{t('changePassword')}</h2>
          <Form onSubmit={handleSubmit}>
            {passwordFormFields.map((field) => (
              <FormField key={field.name}>
                <FormLabel>{t(`${field.name}` as any)}</FormLabel>
                <InputPassword {...field} />
              </FormField>
            ))}
            <FormFooterAction>
              <Button loading={saving} type='submit' disabled={saving}>
                {tGlobal('actions.reset')}
              </Button>
              <CancelButton
                type='reset'
                disabled={saving}
                onClick={handleCancel}>
                {tGlobal('actions.cancel')}
              </CancelButton>
            </FormFooterAction>
          </Form>
        </div>
      </Dialog>
    </div>
  );
}
export default ResetPassword;
