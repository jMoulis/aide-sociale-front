import type { Metadata } from 'next';
import DefaultLayoutRender from '../defaultLayoutRender';
import MainLayout from '../components/MainLayout';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Gestion de placements'
};

export default async function ProfileLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DefaultLayoutRender>
      <MainLayout>{children}</MainLayout>
    </DefaultLayoutRender>
  );
}
