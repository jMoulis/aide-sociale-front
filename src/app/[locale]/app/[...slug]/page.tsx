import type { Metadata } from 'next';
import RenderPage from '../RenderPage';

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
  const { slug } = await params;
  return <RenderPage slug={slug} />;
}
