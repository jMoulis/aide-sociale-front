import type { Metadata } from 'next';
import DefaultLayoutRender from '../defaultLayoutRender';
import {
  getMongoUser,
  getServerSideCurrentUserOrganizationId
} from '@/lib/utils/auth/serverUtils';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import { IWebsite } from '@/lib/interfaces/interfaces';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { routeSecurityMiddleware } from '@/lib/auth/routeSecurityMiddleware';
import { ENUM_RESSOURCES } from '@/lib/interfaces/enums';
import { getPublishedTemplateVersion } from './utils';
import { v4 } from 'uuid';

export const metadata: Metadata = {
  title: "Aide sociale à l'enfance - page d'accueil",
  description: "Bienvenue sur la page d'accueil de l'Aide sociale à l'enfance"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationId = await getServerSideCurrentUserOrganizationId();
  const { data: organizationApp } = await clientMongoServer.get<IWebsite>(
    ENUM_COLLECTIONS.WEBSITES,
    {
      organizationId,
      published: true
    }
  );
  const files = organizationApp?.stylesheets || [];
  const compiledStylesheet = files.find(
    (stylesheet) => stylesheet.name === 'compiled'
  );

  const customHeaders = compiledStylesheet
    ? [
        <link
          key={compiledStylesheet.uri}
          rel='stylesheet'
          href={`${compiledStylesheet.uri}?v=${v4()}`}
        />
      ]
    : [];
  const ROOT = '/app';

  const menus =
    organizationApp?.menus.map((menu) => ({
      ...menu,
      entries: menu.entries.map((entry) => ({
        ...entry,
        uri: entry.uri.length === 1 ? ROOT : `${ROOT}/${entry.uri}`
      }))
    })) || [];

  return (
    <DefaultLayoutRender headers={customHeaders} menus={menus}>
      {children}
    </DefaultLayoutRender>
  );
}
