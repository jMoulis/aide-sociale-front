import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DynamicPage from '../components/DynamicPage';
import { getPublishedTemplateVersion } from '../utils';

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: 'Dashboard'
};

type Props = {
  children: React.ReactNode;
  params: Promise<{
    slug: string[];
  }>;
};
export default async function RootLayout({ params }: Props) {
  const { slug } = await params;
  const { publishedTemplateVersion, page } = await getPublishedTemplateVersion({
    slug
  });
  if (!publishedTemplateVersion) {
    notFound();
  }
  return (
    <>
      <style>{page.props?.style}</style>
      <DynamicPage page={publishedTemplateVersion} />
    </>
  );
}
