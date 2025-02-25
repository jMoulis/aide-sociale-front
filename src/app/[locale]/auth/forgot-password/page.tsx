import type { NextPage } from 'next';
import ForgotPassworForm from './ForgotPasswordForm';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const ForgotPasswordPage: NextPage = async () => {
  const t = await getTranslations('SecuritySection');
  const user = await currentUser();
  if (user) {
    redirect('/');
  }
  return (
    <main className='flex flex-1 flex-col'>
      <section className='flex-1'>
        <h1>{t('forgotPassword')}</h1>
        <Suspense fallback='loading...'>
          <ForgotPassworForm />
        </Suspense>
      </section>
    </main>
  );
};

export default ForgotPasswordPage;
