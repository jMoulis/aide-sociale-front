import { notFound } from 'next/navigation';
import DynamicPage from './components/DynamicPage';
import MainLayout from '../components/MainLayout';
import { collectAsyncPayloads, getPublishedTemplateVersion } from './utils';

export default async function RootPage() {
  try {
    const { template, routeParams } = await getPublishedTemplateVersion({
      slug: ['/']
    });
    const forms = await collectAsyncPayloads(template.vdom, routeParams);

    return (
      <MainLayout>
        <DynamicPage page={template} routeParams={routeParams} forms={forms} />
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
