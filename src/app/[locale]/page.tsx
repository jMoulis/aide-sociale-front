import { getTranslations } from 'next-intl/server';
import MainLayout from './components/MainLayout';

export default async function Home() {
  const t = await getTranslations('HomePage');
  return (
    <MainLayout>
      <h1>{t('title')}</h1>
    </MainLayout>
  );
}
