'use client';
import React, { useEffect, useState } from 'react';
import { useAuth, useSignIn } from '@clerk/nextjs';
import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import Form from '@/components/form/Form';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import FormField from '@/components/form/FormField';
import Button from '@/components/buttons/Button';
import { useTranslations } from 'next-intl';

const ForgotPassworForm: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const t = useTranslations('SecuritySection');
  const tGlobal = useTranslations('GlobalSection');
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  useEffect(() => {
    if (isSignedIn) {
      // router.push('/');
    }
  }, [isLoaded, isSignedIn]);

  // Send the password reset code to the user's email
  async function create(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await signIn
      ?.create({
        strategy: 'reset_password_email_code',
        identifier: email
      })
      .then((_) => {
        setSuccessfulCreation(true);
        setError('');
      })
      .catch((err) => {
        setError(err.errors[0].longMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function reset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await signIn
      ?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password
      })
      .then((result) => {
        // Check if 2FA is required
        if (result.status === 'needs_second_factor') {
          setSecondFactor(true);
          setError('');
        } else if (result.status === 'complete') {
          // Set the active session to
          // the newly created session (user is now signed in)
          setActive({ session: result.createdSessionId });
          setError('');
          router.push('/');
        }
      })
      .catch((err) => {
        setError(err.errors[0].longMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  if (!isLoaded) return null;
  return (
    <Form
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1em'
      }}
      onSubmit={!successfulCreation ? create : reset}>
      {!successfulCreation && (
        <FormField>
          <FormLabel htmlFor='email'>{t('provideEmail')}</FormLabel>
          <Input
            type='email'
            placeholder={tGlobal('emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button loading={loading} disabled={loading}>
            {t('sendPasswordResetCode')}
          </Button>
          {error && <p>{error}</p>}
        </FormField>
      )}

      {true && (
        <>
          <FormField>
            <FormLabel htmlFor='password'>{t('enterNewPassword')}</FormLabel>
            <Input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor='password'>
              {t('enterPasswordResetCode')}
            </FormLabel>
            <Input
              type='text'
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </FormField>
          <Button loading={loading} disabled={loading}>
            {tGlobal('actions.reset')}
          </Button>
          {error && <p>{error}</p>}
        </>
      )}

      {secondFactor && <p>{t('2FARequired')}</p>}
    </Form>
  );
};

export default ForgotPassworForm;
