'use client';

import {
  AsyncPayloadMap,
  IPageTemplateVersion
} from '@/lib/interfaces/interfaces';
import RenderLayout from './RenderLayout';

type Props = {
  page: IPageTemplateVersion;
  routeParams: Record<string, string>;
  asyncData: AsyncPayloadMap;
};
function DynamicPage({ page, routeParams, asyncData }: Props) {
  return (
    <RenderLayout
      pageVersion={page}
      routeParams={routeParams}
      asyncData={asyncData}
    />
  );
}
export default DynamicPage;
