import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DefaultLayoutRender from '../../defaultLayoutRender';

type Props = {
  children: React.ReactNode;
};
async function Layout({ children }: Props) {
  const user = await currentUser();
  if (user) {
    redirect('/');
  }
  return <DefaultLayoutRender>{children}</DefaultLayoutRender>;
}

export default Layout;
