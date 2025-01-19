import type { Metadata } from 'next';
import DefaultLayoutRender from '../defaultLayoutRender';

export const metadata: Metadata = {
  title: "Aide sociale à l'enfance - page d'accueil",
  description: "Bienvenue sur la page d'accueil de l'Aide sociale à l'enfance"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DefaultLayoutRender>{children}</DefaultLayoutRender>;
}
