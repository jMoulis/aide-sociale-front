import type { Metadata } from 'next';
import { dashboardMenus } from './menus/dashboardMenus';
import { Link } from '@/i18n/routing';

export const metadata: Metadata = {
  title: 'Tableau de bord',
  description: "Bienvenue sur le tableau de bord de l'Aide sociale à l'enfance"
};

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex'>
      <aside>
        <ul>
          {dashboardMenus.map((entry) => (
            <li key={entry.href}>
              <Link href={entry.href}>{entry.label}</Link>
            </li>
          ))}
        </ul>
      </aside>
      <main className='flex'>{children}</main>
    </div>
  );
}
