'use client';

import { ENUM_APP_ROUTES } from '@/lib/interfaces/enums';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import WebsiteHeader from './WebsiteHeader';
import { useRouter } from 'next/navigation';
import LeftPanel from './LeftPanel/LeftPanel';
import { usePageBuilderStore } from '../stores/pagebuilder-store-provider';
import { PageBuilderEditor } from '../Builder/PageBuilderEditor';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { IWebsite } from '@/lib/interfaces/interfaces';

type Props = {
  create?: boolean;
};

function WebsitePage({ create }: Props) {
  const router = useRouter();
  const website = usePageBuilderStore((state) => state.website);
  const initializeWebsite = usePageBuilderStore(
    (state) => state.initializeWebsite
  );
  const setWebsite = usePageBuilderStore((state) => state.setWebsite);

  const t = useTranslations('WebsiteSection');

  useEffect(() => {
    if (create && !website) {
      initializeWebsite(t).then((websiteId) => {
        router.push(`${ENUM_APP_ROUTES.MY_APP}/${websiteId}`);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [create, website?._id]);

  useEffect(() => {
    if (website?._id) {
      client.onSnapshotDocument<IWebsite>(
        ENUM_COLLECTIONS.WEBSITES,
        { _id: website._id },
        ({ fullDocument }) => {
          setWebsite(fullDocument);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [website?._id]);

  if (!website) return null;

  return (
    <main className='flex flex-col h-screen'>
      <WebsiteHeader website={website} create={create || false} />
      <div className='flex'>
        <LeftPanel />
        <PageBuilderEditor />
      </div>
    </main>
  );
}
export default WebsitePage;
