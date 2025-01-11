import type { Metadata } from 'next';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import { ENUM_API_ROUTES, ENUM_RESSOURCES } from '@/lib/interfaces/enums';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { routeSecurityMiddleware } from '@/lib/auth/routeSecurityMiddleware';
import MenuLayout from '../components/MenuLayout';
import MainLayout from '../components/MainLayout';

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: 'Admin'
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const webhookUrl = `${process.env.NEXT_PUBLIC_LOCAL_HOST}${ENUM_API_ROUTES.ROLES_WEBHOOK}`;
  clientMongoServer.subscribe(ENUM_COLLECTIONS.ROLES, {}, webhookUrl);

  return routeSecurityMiddleware(ENUM_RESSOURCES.ADMIN, true, ({ menus }) => {
    return (
      <>
        <MenuLayout menus={menus} />
        <MainLayout>
          <section className='flex-1'>{children}</section>
        </MainLayout>
      </>
    );
  });
}
