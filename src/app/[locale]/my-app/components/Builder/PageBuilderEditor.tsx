import React, { useEffect } from 'react';
import LeftPanel from './LeftPanel/LeftPanel';
import RightPanel from './RightPanel';
import Preview from './Preview';
import PageBuilderDesignStyle from './PageBuilderDesignStyle';
import { usePageBuilderStore } from '../stores/pagebuilder-store-provider';
import PageBuilderHeader from './PageBuilderHeader';
import PageBuilderSkeleton from './PageBuilderSkeleton';

export const PageBuilderEditor = () => {
  const [loading, setLoading] = React.useState(true);
  const fetchElements = usePageBuilderStore(
    (state) => state.fetchElementsConfig
  );
  useEffect(() => {
    setLoading(true);
    fetchElements().finally(() => setLoading(false));
  }, [fetchElements]);

  if (loading) return <PageBuilderSkeleton />;
  return (
    <>
      <div className='flex-1'>
        <PageBuilderHeader />
        <div className='flex w-full h-screen'>
          <PageBuilderDesignStyle />
          <LeftPanel />
          <Preview />
          <RightPanel />
        </div>
      </div>
    </>
  );
};
