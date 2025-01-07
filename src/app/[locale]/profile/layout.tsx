import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ENUM_APP_ROUTES } from '@/lib/interfaces/enums';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Gestion de placements'
};

export default async function ProfileLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = await getTranslations('ProfileSection');

  return (
    <>
      <aside>
        <nav>
          <ul>
            <li>
              <Link href={ENUM_APP_ROUTES.PROFILE}>{t('account')}</Link>
            </li>
            <li>
              <Link href={ENUM_APP_ROUTES.PROFILE_SECURITY}>
                {t('security')}
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main>{children}</main>
    </>
  );
}
