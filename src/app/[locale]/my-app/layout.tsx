import type { Metadata } from 'next';
import MainLayout from '../components/MainLayout';

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: 'Admin'
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  return (
    <div className='flex col-span-full flex-col'>
      <header className='flex justify-between items-center p-4 bg-gray-800 text-white'>
        <h1>{process.env.NEXT_PUBLIC_APP_NAME}</h1>
      </header>
      <div className='flex flex-1'>
        <aside>Menu</aside>
        <MainLayout>{children}</MainLayout>
      </div>
    </div>
  );
  // return routeSecurityMiddleware(ENUM_RESSOURCES.MY_WEBSITE, true, ({ menus }) => {
  //   return (
  //     <>
  //       {/* <MenuLayout menus={menus} />
  //       <MainLayout> */}
  //         <section className='flex-1'>{children}</section>
  //       {/* </MainLayout> */}
  //     </>
  //   );
  // });
}
