import React from 'react';
import LeftPanel from './LeftPanel/LeftPanel';
import RightPanel from './RightPanel';
import PageBuilderHeader from './PageBuilderHeader';
import PageBuilderSkeleton from './PageBuilderSkeleton';
import { useInitializeBuilder } from './useInitializeBuilder';
import { RenderScene } from './RenderScene';

export const PageBuilderEditor = () => {
  const loading = useInitializeBuilder();
  if (loading) return <PageBuilderSkeleton />;
  return (
    <div className='flex-col flex'>
      <PageBuilderHeader />
      <div className='flex max-w-[calc(100vw_-_250px)]'>
        <LeftPanel />
        <RenderScene />
        <RightPanel />
      </div>
    </div>
  );
};
