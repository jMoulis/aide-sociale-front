'use client';

import Dialog from '@/components/dialog/Dialog';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useToast } from '@/lib/hooks/use-toast';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Button from '@/components/buttons/Button';
import useClerkErrorLocalization from '@/lib/hooks/useClerkErrorLocalization';
import { deleteUser } from '../../actions';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import Input from '@/components/form/Input';
import { useRouter } from 'next/navigation';

import { faTrash } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CancelButton from '@/components/buttons/CancelButton';
import { ENUM_APP_ROUTES } from '@/lib/interfaces/enums';
import Form from '@/components/form/Form';

type Props = {
  userId: string | null;
  userEmail: string | null;
};
function DeleteUser({ userId, userEmail }: Props) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('SecuritySection');
  const tGlobal = useTranslations('GlobalSection');
  const tError = useTranslations('ErrorSection');
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const { onCatchErrors } = useClerkErrorLocalization();
  const [confirmString, setConfirmString] = useState('');
  const [canDelete, setCanDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setSaving(true);
      if (!userId) {
        toast({
          title: tError('errorUserMissingId.title'),
          description: tError('errorUserMissingId.description'),
          variant: 'destructive'
        });
        return;
      }
      const response = await deleteUser(userId);
      toast({
        title: response.title,
        description: response.description,
        variant: response.isError ? 'destructive' : 'default'
      });
      setSaving(false);
      if (!response.isError) {
        setOpen(false);
        router.push(ENUM_APP_ROUTES.ADMIN_USERS);
      }
    } catch (error: any) {
      setSaving(false);
      const translatedErrors = onCatchErrors(error);
      toast({
        title: tError('errorSecurity.title'),
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

  const handleConfirmString = (e: FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setConfirmString(value);
    if (value === userEmail) {
      setCanDelete(true);
    } else {
      setCanDelete(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        Trigger={
          <Button className='flex items-center w-full text-red-500'>
            <FontAwesomeIcon icon={faTrash} className='mr-2' />
            <span className='text-xs whitespace-nowrap'>
              {t('delete.action')}
            </span>
          </Button>
        }>
        {open ? (
          <Form onSubmit={handleSubmit}>
            <h2>{t('delete.title')}</h2>
            <p className='my-2'>{t('delete.description')}</p>
            <FormField>
              <FormLabel htmlFor='email'>
                {t.rich('delete.toConfirm', {
                  userEmail,
                  code: (chunks) => (
                    <code className='bg-slate-100 rounded px-1'>{chunks}</code>
                  )
                })}
              </FormLabel>
              <Input
                ref={inputRef}
                onChange={handleConfirmString}
                value={confirmString}
              />
            </FormField>
            <FormFooterAction>
              <Button
                loading={saving}
                className='bg-red-500'
                type='submit'
                disabled={saving || !canDelete}>
                {t('delete.action')}
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
export default DeleteUser;
