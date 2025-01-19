'use client';

import * as React from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { isClerkErrors } from '@/lib/utils/auth/utils';
import { toast } from '@/lib/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { ISignupApiBody } from '@/lib/interfaces/api/auth/interfaces';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ENUM_API_ROUTES } from '@/lib/interfaces/enums';

const formSchema = z.object({
  identifier: z.string().min(2, {
    message: 'Identifier must be at least 2 characters.'
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.'
  }),
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.'
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.'
  })
});

const formVerifyCodeSchema = z.object({
  code: z.string().min(6, {
    message: 'Code must be at least 6 characters.'
  })
});
export default function SignupForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verifying, setVerifying] = React.useState(false);

  const router = useRouter();
  const t = useTranslations('SecuritySection.signUp');
  const tProfile = useTranslations('ProfileSection');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: '',
      password: '',
      firstName: '',
      lastName: ''
    }
  });

  const formVerifyCode = useForm<z.infer<typeof formVerifyCodeSchema>>({
    resolver: zodResolver(formVerifyCodeSchema),
    defaultValues: {
      code: ''
    }
  });
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isLoaded) return;

    // Start the sign-up process using the email and password provided
    try {
      await signUp.create({
        firstName: values.firstName,
        lastName: values.lastName,
        emailAddress: values.identifier,
        password: values.password
      });
      // Send the user an email with the verification code
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code'
      });

      // Set 'verifying' true to display second form
      // and capture the OTP code
      setVerifying(true);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setVerifying(false);
    form.reset();
    formVerifyCode.reset();
  };

  // Handle the submission of the verification form
  const handleVerify = async (values: z.infer<typeof formVerifyCodeSchema>) => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: values.code
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        // TODO 'Add orgnization attachment logic on successful sign up');
        const mainFormValues = form.getValues();
        const signupApiBody: ISignupApiBody = {
          authId: signUpAttempt.createdUserId as string,
          firstName: mainFormValues.firstName,
          lastName: mainFormValues.lastName,
          email: mainFormValues.identifier,
          organizationId: 'undefined'
        };
        await fetch(ENUM_API_ROUTES.SIGN_UP, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(signupApiBody)
        });
        const { createdSessionId } = await signUpAttempt.reload();
        await setActive({ session: createdSessionId });
        router.push('/');
      } else {
        toast({
          title: 'Error',
          description: signUpAttempt.missingFields?.join(', '),
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      const { status, parsedError } = isClerkErrors(error);
      if (status) {
        resetForm();
        toast({
          title: 'Error',
          description: parsedError.errors
            ?.map((err: any) => err.message)
            .join(', '),
          variant: 'destructive'
        });
      }
    }
  };

  // Display the verification form to capture the OTP code
  if (verifying) {
    return (
      <>
        <h1>{t('verifyCodeEmail.title')}</h1>
        <Form {...formVerifyCode}>
          <form onSubmit={formVerifyCode.handleSubmit(handleVerify)}>
            <FormField
              control={formVerifyCode.control}
              name='code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('enterVerifyCode')}</FormLabel>
                  <Input
                    {...field}
                    required
                    placeholder={t('enterVerifyCode')}
                  />
                </FormItem>
              )}
            />
            <div>
              <Button type='submit'>{t('verify')}</Button>
            </div>
          </form>
        </Form>
      </>
    );
  }

  // Display the initial sign-up form to capture the email and password
  return (
    <>
      <h1>{t('title')}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-2'>
          <h1>Identité</h1>
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='firstName'>
                  {tProfile('firstName')}
                </FormLabel>
                <Input
                  {...field}
                  required
                  placeholder={tProfile('placeholders.firstName')}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='lastName'>{tProfile('lastName')}</FormLabel>
                <Input
                  {...field}
                  placeholder={tProfile('placeholders.lastName')}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='identifier'
            render={({ field }) => (
              <>
                <h1>Sécurité</h1>
                <FormItem>
                  <FormLabel htmlFor='email'>
                    {t('labels.identifier')}
                  </FormLabel>
                  <Input
                    {...field}
                    placeholder={t('placeholders.identifier')}
                  />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='password'>{t('labels.password')}</FormLabel>
                <Input
                  {...field}
                  type='password'
                  placeholder={t('placeholders.password')}
                />
              </FormItem>
            )}
          />
          <div>
            <Button type='submit'>{t('title')}</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
