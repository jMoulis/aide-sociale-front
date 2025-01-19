import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

async function Unauthorized() {
  const t = await getTranslations('GlobalSection');
  const tSecu = await getTranslations('SecuritySection');
  return (
    <div>
      <h1>{tSecu('unAuthorized')}</h1>
      <Link href='/sign-in'>{t('actions.signIn')}</Link>
    </div>
  );
}
export default Unauthorized;
