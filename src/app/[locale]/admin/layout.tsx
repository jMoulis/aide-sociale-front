import type { Metadata } from 'next';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import { ENUM_API_ROUTES, ENUM_RESSOURCES } from '@/lib/interfaces/enums';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { routeSecurityMiddleware } from '@/lib/auth/routeSecurityMiddleware';
import DefaultLayoutRender from '../defaultLayoutRender';

const menus = [
  {
    _id: '8054d2bf-23eb-472c-9747-d6ze7e75d59d',
    roles: ['675fd2449e59e676a0d1d733', '336c6204-dd35-46b9-b0df-4e5b3b719d36'],
    title: 'Menu administration',
    entries: [
      {
        label: 'Ressources',
        uri: '/admin/ressources',
        roles: []
      },
      {
        label: 'Admin',
        uri: '/admin',
        roles: []
      },
      {
        label: 'Utilisateurs',
        uri: '/admin/users',
        roles: [
          '675fd2449e59e676a0d1d733',
          '336c6204-dd35-46b9-b0df-4e5b3b719d36'
        ]
      },
      {
        label: 'Collections',
        uri: '/admin/collections',
        roles: [
          '336c6204-dd35-46b9-b0df-4e5b3b719d36',
          '675fd2449e59e676a0d1d733'
        ]
      },
      {
        label: 'My app',
        uri: '/admin/my-app',
        roles: [
          '675fd2449e59e676a0d1d733',
          '336c6204-dd35-46b9-b0df-4e5b3b719d36',
          '2f769cef-b32d-4d31-94e2-647556c1337f'
        ]
      },
      {
        label: 'Assistant Webpage',
        uri: '/admin/assistant-webpage',
        roles: [
          '675fd2449e59e676a0d1d733',
          '336c6204-dd35-46b9-b0df-4e5b3b719d36',
          '2f769cef-b32d-4d31-94e2-647556c1337f'
        ]
      }
    ]
  },
  {
    _id: '4c9e2d00-eb1a-4070-8313-7b4f32982dc3',
    title: 'Menu Autorisation',
    entries: [
      {
        label: 'Rôles',
        uri: '/admin/roles',
        roles: []
      },
      {
        label: 'Templates',
        uri: '/admin/templates',
        roles: []
      }
    ],
    roles: ['336c6204-dd35-46b9-b0df-4e5b3b719d36', '675fd2449e59e676a0d1d733']
  }
];
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

  return (
    <>
      {routeSecurityMiddleware(ENUM_RESSOURCES.ADMIN, true, () => {
        return (
          <DefaultLayoutRender menus={menus}>
            <section className='flex-1'>{children}</section>
          </DefaultLayoutRender>
        );
      })}
    </>
  );
}
