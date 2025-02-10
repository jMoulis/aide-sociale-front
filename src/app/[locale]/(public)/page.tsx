'use client';

import MainLayout from '../components/MainLayout';
export default function RootPage() {
  return (
    <MainLayout>
      <h1>Page</h1>
    </MainLayout>
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
