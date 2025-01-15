import { routeSecurityMiddleware } from '@/lib/auth/routeSecurityMiddleware';
import { ENUM_RESSOURCES } from '@/lib/interfaces/enums';
import MenuLayout from '../components/MenuLayout';
import MainLayout from '../components/MainLayout';

type Props = {
  children: React.ReactNode;
};
async function DashboardLayout({ children }: Props) {
  return routeSecurityMiddleware(
    ENUM_RESSOURCES.DASHBOARD,
    true,
    ({ menus }) => {
      return (
        <>
          <MenuLayout menus={menus} />
          <MainLayout>{children}</MainLayout>
        </>
      );
    }
  );
}

export default DashboardLayout;
