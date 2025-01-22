import type { Metadata } from 'next';
import DefaultLayoutRender from '../defaultLayoutRender';
import { getServerSideCurrentUserOrganizationId } from '@/lib/utils/auth/serverUtils';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import { IWebsite } from '@/lib/interfaces/interfaces';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';

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
      organizationId
    }
  );

  const files = organizationApp?.stylesheets || [];
  const customHeaders = files.map((file) => (
    <link key={file} rel='stylesheet' href={`${file}`} />
  ));

  return (
    <DefaultLayoutRender headers={customHeaders}>
      {children}
    </DefaultLayoutRender>
  );
}
