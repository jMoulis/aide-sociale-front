import { getTranslations } from 'next-intl/server';
import SignInForm from './SignInForm';

async function SignInPage() {
  const t = await getTranslations('SecuritySection');

  return (
    <div>
      <h1>{t('signIn.title')}</h1>
      <SignInForm />
    </div>
  );
}

export default SignInPage;
