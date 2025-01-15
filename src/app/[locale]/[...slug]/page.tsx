import { IWebsite } from '@/lib/interfaces/interfaces';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import {
  IFormTemplate,
  IMasterTemplate
} from '@/lib/TemplateBuilder/interfaces';
import { notFound } from 'next/navigation';
import DynamicPage from './components/DynamicPage';
import { getServerSideCurrentUserOrganizationId } from '@/lib/utils/auth/serverUtils';

const KNOWN_LOCALES = ['en', 'fr', 'es', 'de']; // etc.

const isDetailPage = (slug: string[]) => {
  // 1. Copy the original slug so we don’t mutate the caller’s array.
  const tempSlug = [...slug];

  // 2. If the first segment is a known locale, remove it.
  //    e.g. /en/customers/123 => slug = ["en", "customers", "123"]
  //        after shift => ["customers", "123"]
  if (KNOWN_LOCALES.includes(tempSlug[0])) {
    tempSlug.shift();
  }

  // 3. Now apply your detail/list logic to the updated array.
  if (tempSlug.length < 1) {
    // No meaningful segments left
    return {
      route: '',
      isDetail: false
    };
  }

  // If there’s only 1 segment left, that’s our collection.
  if (tempSlug.length === 1) {
    return {
      route: tempSlug[0],
      isDetail: false
    };
  }

  // Otherwise, assume the last one is a document ID, and the one before is the collection.
  const route = tempSlug[tempSlug.length - 2];
  const documentId = tempSlug[tempSlug.length - 1];

  return {
    route,
    isDetail: true,
    documentId
  };
};

type Props = {
  params: Promise<{
    slug: string[];
  }>;
};
async function Page({ params }: Props) {
  const { slug } = await params;
  const organizationId = await getServerSideCurrentUserOrganizationId();

  const { route } = isDetailPage(slug);
  const { data: organizationApp } = await clientMongoServer.get<IWebsite>(
    ENUM_COLLECTIONS.WEBSITES,
    {
      organizationId
    }
  );
  if (!organizationApp) {
    notFound();
  }
  const page = organizationApp.pages.find((p) => p.route === route);
  if (!page) {
    notFound();
  }
  if (!page.masterTemplates?.[0]) {
    notFound();
  }
  const { data: masterTemplate } = await clientMongoServer.get<IMasterTemplate>(
    ENUM_COLLECTIONS.TEMPLATES_MASTER,
    {
      _id: page.masterTemplates?.[0]
    }
  );
  if (!masterTemplate) {
    notFound();
  }
  const { data: publishedTemplate } =
    await clientMongoServer.get<IFormTemplate>(ENUM_COLLECTIONS.TEMPLATES, {
      _id: masterTemplate.publishedVersionId
    });
  if (!publishedTemplate) {
    notFound();
  }
  const updatedBlocks = await Promise.all(
    publishedTemplate.blocks.map(async (block) => {
      const newFields = await Promise.all(
        block.fields.map(async (field) => {
          const collectionName = field.collectionName;
          if (field.optionsSourceType === 'database' && collectionName) {
            const { data: docs } = await clientMongoServer.list<any>(
              collectionName as any
            );
            if (!docs) return field;

            const resolvedOptions = docs.map((doc) => {
              const label = field.labelField ? doc[field.labelField] : doc._id;
              const value = field.valueField ? doc[field.valueField] : doc._id;
              return { label, value };
            });

            return {
              ...field,
              resolvedOptions
            };
          }
          return field;
        })
      );

      return { ...block, fields: newFields };
    })
  );
  const finalTemplate: IFormTemplate = {
    ...publishedTemplate,
    blocks: updatedBlocks
  };
  return (
    <DynamicPage
      template={finalTemplate}
      collectionName={publishedTemplate.globalCollectionName}
    />
  );
  // console.log(publishedTemplate);
  return <h1>Page</h1>;
  // if (route) {
  //   const { data: page } = await clientMongoServer.get<IRessource>(
  //     ENUM_COLLECTIONS.PAGES,
  //     {
  //       route,
  //       organizationId
  //     }
  //   );
  //   if (!page) {
  //     console.log('Page not found');
  //     notFound();
  //   }
  //   const { data: masterTemplate } =
  //     await clientMongoServer.get<IMasterTemplate>(
  //       ENUM_COLLECTIONS.TEMPLATES_MASTER,
  //       {
  //         _id: page.templateId
  //       }
  //     );
  //   // const masterTemplate = mastersTemplates?.[0];
  //   if (masterTemplate) {
  //     const { data: publishedTemplate } =
  //       await clientMongoServer.get<IFormTemplate>(ENUM_COLLECTIONS.TEMPLATES, {
  //         _id: masterTemplate.publishedVersionId
  //       });
  //     if (!publishedTemplate) {
  //       console.log('No published template');
  //       notFound();
  //     }
  //     const updatedBlocks = await Promise.all(
  //       publishedTemplate.blocks.map(async (block) => {
  //         const newFields = await Promise.all(
  //           block.fields.map(async (field) => {
  //             const collectionName =
  //               field.collectionName || publishedTemplate.globalCollectionName;
  //             if (field.optionsSourceType === 'database' && collectionName) {
  //               const { data: docs } = await clientMongoServer.list<any>(
  //                 collectionName as any
  //               );
  //               if (!docs) return field;

  //               const resolvedOptions = docs.map((doc) => {
  //                 const label = field.labelField
  //                   ? doc[field.labelField]
  //                   : doc._id;
  //                 const value = field.valueField
  //                   ? doc[field.valueField]
  //                   : doc._id;
  //                 return { label, value };
  //               });

  //               return {
  //                 ...field,
  //                 resolvedOptions
  //               };
  //             }
  //             return field;
  //           })
  //         );

  //         return { ...block, fields: newFields };
  //       })
  //     );
  //     const finalTemplate: IFormTemplate = {
  //       ...publishedTemplate,
  //       blocks: updatedBlocks
  //     };
  //     console.log(publishedTemplate.globalCollectionName);
  //     if (!publishedTemplate?.globalCollectionName) {
  //       console.log('No collection name');
  //       notFound();
  //     }
  //     if (!isDetail) {
  //       return (
  //         <DynamicPage
  //           template={finalTemplate}
  //           collectionName={publishedTemplate.globalCollectionName}
  //         />
  //       );
  //     }

  //     const { data } = await clientMongoServer.get<any>(
  //       publishedTemplate.globalCollectionName as any,
  //       {
  //         _id: documentId
  //       }
  //     );
  //     return (
  //       <DynamicPage
  //         template={finalTemplate}
  //         previousData={{ data }}
  //         documentId={documentId}
  //         collectionName={publishedTemplate.globalCollectionName}
  //       />
  //     );
  //   }
  // }
}
export default Page;
