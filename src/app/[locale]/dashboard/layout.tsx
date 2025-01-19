import type { Metadata } from 'next';
import { readdir } from 'fs/promises';
import { join } from 'path';
import DefaultLayoutRender from '../defaultLayoutRender';
import { getServerSideCurrentUserOrganizationId } from '@/lib/utils/auth/serverUtils';

async function getFiles(subPath: string): Promise<string[]> {
  try {
    const directory = join(process.cwd(), 'styles', subPath);
    const files = await readdir(directory);
    console.log(directory);
    return files.map((file) => join('/', subPath, file));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error reading directory:', err);
    return [];
  }
}

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
  const files = await getFiles(`/${organizationId}`);
  console.log(files);
  const customHeaders = files.map((file) => (
    <link key={file} rel='stylesheet' href={file} />
  ));

  return (
    <DefaultLayoutRender headers={customHeaders}>
      {children}
    </DefaultLayoutRender>
  );
}
