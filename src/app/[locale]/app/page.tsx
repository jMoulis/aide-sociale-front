import { notFound } from 'next/navigation';
import DynamicPage from './components/DynamicPage';
import MainLayout from '../components/MainLayout';
import { getPublishedTemplateVersion } from './utils';

export default async function RootPage() {
  try {
    const { publishedTemplateVersion } = await getPublishedTemplateVersion({
      slug: ['/']
    });
    // const getStylesheets = Promise.all()
    return (
      <MainLayout>
        <DynamicPage page={publishedTemplateVersion} />
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
