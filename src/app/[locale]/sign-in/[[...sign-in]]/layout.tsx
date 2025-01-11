import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

type Props = {
  children: React.ReactNode;
};
async function Layout({ children }: Props) {
  const user = await currentUser();
  if (user) {
    redirect('/');
  }
  return <>{children}</>;
}

export default Layout;
