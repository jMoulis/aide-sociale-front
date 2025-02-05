import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DynamicPage from '../components/DynamicPage';
import { collectAsyncPayloads, getPublishedTemplateVersion } from '../utils';
import MainLayout from '../../components/MainLayout';

// const populateInitialVdomDataRecursive = async (
//   vdom: IVDOMNode,
//   routeParams: Record<string, string>
// ): Promise<IVDOMNode> => {
//   // Create a shallow copy of the current node to maintain immutability.
//   const updatedNode = { ...vdom };
//   // Check if the node's context has a dataset
//   const dataset = updatedNode.context?.dataset;
//   if (dataset) {
//     const { collectionSlug, connexion } = dataset;
//     if (collectionSlug && connexion) {
//       const { routeParam } = connexion;
//       // If a routeParam is provided, ensure that the corresponding value exists in routeParams.
//       if (!routeParam || (routeParam && routeParams[routeParam])) {
//         // Use the routeParam value if available.
//         const param = routeParam ? routeParams[routeParam] : undefined;
//         try {
//           // Perform the async call to fetch data.
//           const { data } = await clientMongoServer.get(
//             collectionSlug as ENUM_COLLECTIONS,
//             { _id: param }
//           );
//           if (data) {
//             // Attach the fetched data as formData in the context.
//             updatedNode.context = {
//               ...updatedNode.context,
//               formData: data
//             };
//           }
//         } catch (error) {
//           console.error(
//             `Error fetching data for node ${updatedNode._id}:`,
//             error
//           );
//         }
//       }
//     }
//   }

//   // Process children recursively.
//   if (updatedNode.props && Array.isArray(updatedNode.props.children)) {
//     updatedNode.props.children = await Promise.all(
//       updatedNode.props.children.map((child) =>
//         populateInitialVdomDataRecursive(child, routeParams)
//       )
//     );
//   }

//   return updatedNode;
// };
export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: 'Dashboard'
};

type Props = {
  params: Promise<{
    slug: string[];
  }>;
};

export default async function RootLayout({ params }: Props) {
  try {
    const { slug } = await params;
    const { template, routeParams } = await getPublishedTemplateVersion({
      slug
    });
    const forms = await collectAsyncPayloads(template.vdom, routeParams);
    return (
      <MainLayout>
        <DynamicPage page={template} routeParams={routeParams} forms={forms} />
      </MainLayout>
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    notFound();
  }
}
