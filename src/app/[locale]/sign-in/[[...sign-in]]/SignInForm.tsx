'use client';

import * as React from 'react';
import { useAuth, useSignIn } from '@clerk/nextjs';
import { useTranslations } from 'next-intl';
import { toast } from '@/lib/hooks/use-toast';
import useClerkErrorLocalization from '@/lib/hooks/useClerkErrorLocalization';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { signInWithCustomToken } from 'firebase/auth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { auth } from '@/lib/firebase/firebaseClient';

const formSchema = z.object({
  identifier: z.string().min(2, {
    message: 'Identifier must be at least 2 characters.'
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.'
  })
});

export default function SignInForm() {
  const { signIn, setActive } = useSignIn();
  const tError = useTranslations('ErrorSection');
  const tGlobal = useTranslations('GlobalSection');
  const tSecurity = useTranslations('SecuritySection');

  const { onCatchErrors } = useClerkErrorLocalization();
  const { getToken } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  });
  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!signIn) return;

      const signInAttempt = await signIn.create({
        identifier: values.identifier,
        password: values.password
      });
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        const token = await getToken({ template: 'integration_firebase' });
        await signInWithCustomToken(auth, token || '');
      } else {
        // setError(signInAttempt.status || 'An error occurred');
        toast({
          title: tError('signIn.title'),
          description: tError('signIn.description'),
          variant: 'destructive'
        });
      }
    } catch (err: any) {
      const errors = onCatchErrors(err);

      toast({
        title: tError('signIn.title'),
        description: errors.join(', '),
        variant: 'destructive'
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-2'>
        <FormField
          control={form.control}
          name='identifier'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSecurity('signIn.labels.identifier')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={tSecurity('signIn.placeholders.identifier')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSecurity('signIn.labels.password')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={tSecurity('signIn.placeholders.password')}
                  type='password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button size='sm' type='submit'>
          {tGlobal('actions.submit')}
        </Button>
      </form>
    </Form>
  );
}
