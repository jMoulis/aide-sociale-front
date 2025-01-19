import { getTranslations } from 'next-intl/server';
import PasswordForm from './PasswordForm';

async function ProfileSecurity() {
  const t = await getTranslations('SecuritySection');

  return (
    <div>
      <h1>{t('title')}</h1>
      <PasswordForm />
    </div>
  );
}

export default ProfileSecurity;
