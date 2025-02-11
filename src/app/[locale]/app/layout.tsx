import type { Metadata } from 'next';
import DefaultLayoutRender from '../defaultLayoutRender';
import { getServerSideCurrentUserOrganizationId } from '@/lib/utils/auth/serverUtils';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import { IMenuEntry, IWebsite } from '@/lib/interfaces/interfaces';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { nanoid } from 'nanoid';

export const metadata: Metadata = {
  title: 'Solinn app - Accueil',
  description: "Bienvenue sur la page d'accueil de Solinn app"
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
          href={`${compiledStylesheet.uri}?v=${nanoid()}`}
        />
      ]
    : [];
  const ROOT = '/app';

  const buildRootedEntry = (entry: IMenuEntry) => ({
    ...entry,
    uri: entry.uri.length === 1 ? ROOT : `${ROOT}/${entry.uri}`
  });
  const menus =
    organizationApp?.menus.map((menu) => ({
      ...menu,
      entries: menu.entries.map(buildRootedEntry)
    })) || [];

  return (
    <DefaultLayoutRender headers={customHeaders} menus={menus}>
      {children}
    </DefaultLayoutRender>
  );
}
