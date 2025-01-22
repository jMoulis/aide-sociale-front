import React, { useEffect } from 'react';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import Preview from './Preview';
import { usePageBuilderStore } from './usePageBuilderStore';
import PageBuilderDesignStyle from './PageBuilderDesignStyle';
import SaveButton from '@/components/buttons/SaveButton';
import { IPageTemplateVersion } from '@/lib/interfaces/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { generatePageVersion } from './generators';
import Button from '@/components/buttons/Button';

export const PageBuilderEditor = () => {
  const fetchElements = usePageBuilderStore(
    (state) => state.fetchElementsConfig
  );

  const pageVersion = usePageBuilderStore((state) => state.pageVersion);
  const onPublish = usePageBuilderStore((state) => state.onPublish);
  const setSelectedVersionPage = usePageBuilderStore(
    (state) => state.setSelectedVersionPage
  );

  useEffect(() => {
    fetchElements();
  }, [fetchElements]);

  const handleSave = async () => {
    if (pageVersion) {
      await client.update(
        ENUM_COLLECTIONS.PAGE_TEMPLATES,
        {
          _id: pageVersion._id
        },
        {
          $set: pageVersion
        }
      );
    }
  };

  const handleCopy = async () => {
    if (!pageVersion?.masterTemplateId) return;
    const newVersion = pageVersion.version + 1;
    const generateDefaultPageVersion = generatePageVersion(
      pageVersion.masterTemplateId,
      newVersion
    );
    const newPageVersion: IPageTemplateVersion = {
      ...generateDefaultPageVersion,
      vdom: pageVersion.vdom
    };
    await client.create<IPageTemplateVersion>(
      ENUM_COLLECTIONS.PAGE_TEMPLATES,
      newPageVersion
    );
  };

  if (!pageVersion) return null;
  return (
    <div className='flex-1'>
      <Button onClick={() => setSelectedVersionPage(null)}>Back</Button>
      <div className='flex-1'>
        <header className='flex items-center p-4 bg-white'>
          <h1>Page builder - {pageVersion?.version}</h1>
          <SaveButton onClick={handleSave} />
          <SaveButton onClick={handleCopy}>Duplicate</SaveButton>
          <SaveButton onClick={onPublish}>Publish</SaveButton>
        </header>
        <div className='flex w-full h-screen'>
          <PageBuilderDesignStyle />
          <LeftPanel />
          <Preview />
          <RightPanel />
        </div>
      </div>
    </div>
  );
};
