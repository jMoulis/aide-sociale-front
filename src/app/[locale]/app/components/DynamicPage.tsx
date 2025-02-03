'use client';

import { IPageTemplateVersion } from '@/lib/interfaces/interfaces';
import RenderLayout from './RenderLayout';

type Props = {
  page: IPageTemplateVersion;
};
function DynamicPage({ page }: Props) {
  // return <div>{<RenderElement node={page.vdom} />}</div>;
  return <RenderLayout layout={page.vdom} />;
}
export default DynamicPage;
