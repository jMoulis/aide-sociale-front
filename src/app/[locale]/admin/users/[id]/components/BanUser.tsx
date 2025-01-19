'use client';

import Dialog from '@/components/dialog/Dialog';
import Form from '@/components/form/Form';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useToast } from '@/lib/hooks/use-toast';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Button from '@/components/buttons/Button';
import useClerkErrorLocalization from '@/lib/hooks/useClerkErrorLocalization';
import { banUser } from '../../actions';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import Input from '@/components/form/Input';
import {
  faBan,
  faCircleCheck
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CancelButton from '@/components/buttons/CancelButton';

type Props = {
  userId: string | null;
  userEmail: string | null;
  isBanned: boolean;
  onUpdate: (banned: boolean) => void;
};
function BanUser({ userId, userEmail, isBanned, onUpdate }: Props) {
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
      const response = await banUser(userId, isBanned);
      toast({
        title: response.title,
        description: response.description,
        variant: response.isError ? 'destructive' : 'default'
      });
      setSaving(false);
      onUpdate(!isBanned);

      if (!response.isError) {
        setConfirmString('');
        setOpen(false);
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
    setConfirmString('');
  };

  const contextualTranslation = useCallback(
    (translationKey: string, rich: boolean, props?: any) => {
      const root = isBanned ? 'unbanUser' : 'banUser';
      if (rich) {
        return t.rich(`${root}.${translationKey}` as any, props);
      }
      return t(`${root}.${translationKey}` as any, props);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isBanned]
  );

  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        Trigger={
          <Button
            className={`flex items-center w-full ${
              isBanned ? '' : 'text-red-500'
            }`}>
            <FontAwesomeIcon
              icon={isBanned ? faCircleCheck : faBan}
              className='mr-2'
            />
            <span className='text-xs whitespace-nowrap'>
              {contextualTranslation('action', false)}
            </span>
          </Button>
        }>
        {open ? (
          <Form onSubmit={handleSubmit}>
            <h2>{contextualTranslation('title', false)}</h2>
            <p className='my-2'>
              {contextualTranslation('description', false)}
            </p>
            <FormField>
              <FormLabel htmlFor='email'>
                {contextualTranslation('toConfirm', true, {
                  userEmail,
                  code: (chunks: string) => (
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
                className={isBanned ? '' : 'bg-red-500'}
                type='submit'
                disabled={saving || !canDelete}>
                {contextualTranslation('action', false)}
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
export default BanUser;
