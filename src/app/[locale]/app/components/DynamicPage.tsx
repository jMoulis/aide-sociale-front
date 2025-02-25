'use client';

import {
  AsyncPayloadMap,
  IPageTemplateVersion,
  IStylesheet
} from '@/lib/interfaces/interfaces';
import RenderLayout from './RenderLayout';
import { useEffect } from 'react';
import { nanoid } from 'nanoid';

type Props = {
  page: IPageTemplateVersion;
  routeParams: Record<string, string>;
  asyncData: AsyncPayloadMap;
  headers?: IStylesheet;
};
function DynamicPage({ page, routeParams, asyncData, headers }: Props) {
  useEffect(() => {
    if (!headers) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${headers.uri}?v=${nanoid()}`;
    document.head.appendChild(link);
  }, [headers]);

  return (
    <>
      <RenderLayout
        pageVersion={page}
        routeParams={routeParams}
        asyncData={asyncData}
      />
    </>
  );
}
export default DynamicPage;
