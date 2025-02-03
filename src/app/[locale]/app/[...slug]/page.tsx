import { IPageTemplateVersion, IWebsite } from '@/lib/interfaces/interfaces';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { IMasterTemplate } from '@/lib/TemplateBuilder/interfaces';
import { getServerSideCurrentUserOrganizationId } from '@/lib/utils/auth/serverUtils';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DynamicPage from '../components/DynamicPage';
import { ClerkProvider } from '@clerk/nextjs';
import { getPublishedTemplateVersion } from '../utils';
import MainLayout from '../../components/MainLayout';

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: 'Dashboard'
};

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
export default async function RootLayout({ params }: Props) {
  try {
    const { slug } = await params;
    const { publishedTemplateVersion, page } =
      await getPublishedTemplateVersion({ slug });
    return (
      <MainLayout>
        <style>{page.props?.style}</style>
        <DynamicPage page={publishedTemplateVersion} />
      </MainLayout>
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    notFound();
  }
}
