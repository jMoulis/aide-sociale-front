import type { Metadata } from 'next';

import Link from 'next/link';

import clientMongoServer from '@/lib/mongo/initMongoServer';
import {
  ENUM_API_ROUTES,
  ENUM_APP_ROUTES,
  ENUM_RESSOURCES
} from '@/lib/interfaces/enums';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { routeSecurityMiddleware } from '@/lib/auth/routeSecurityMiddleware';

export const metadata: Metadata = {
  title: 'Placement app',
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
  return routeSecurityMiddleware(ENUM_RESSOURCES.ADMIN, true, () => (
    <>
      <div>
        <nav>
          <ul>
            <li>
              <Link href={ENUM_APP_ROUTES.ADMIN_PAGE}>Admin</Link>
            </li>
            <li>
              <Link href={ENUM_APP_ROUTES.ADMIN_ROLES}>Roles</Link>
            </li>
            <li>
              <Link href={ENUM_APP_ROUTES.ADMIN_USERS}>Users</Link>
            </li>
            <li>
              <Link href={ENUM_APP_ROUTES.RESSOURCES}>Ressources</Link>
            </li>
          </ul>
        </nav>
      </div>
      <main>
        <section className='flex-1'>{children}</section>
      </main>
    </>
  ));
}
