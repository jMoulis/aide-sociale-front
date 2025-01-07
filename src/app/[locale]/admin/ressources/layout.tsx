import type { Metadata } from 'next';
import { routeSecurityMiddleware } from '@/lib/auth/routeSecurityMiddleware';
import { ENUM_RESSOURCES } from '@/lib/interfaces/enums';

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
  return routeSecurityMiddleware(ENUM_RESSOURCES.ROLES, true, () => children);
}
