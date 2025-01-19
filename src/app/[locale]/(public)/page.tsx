import { notFound } from 'next/navigation';
import MainLayout from '../components/MainLayout';

export default async function RootLayout() {
  try {
    return (
      <MainLayout>
        <h1>Page</h1>
      </MainLayout>
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error', error);
    return notFound();
  }

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
