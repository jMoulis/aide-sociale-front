'use client';

import { IPage, IPageTemplateVersion } from '@/lib/interfaces/interfaces';
import { RenderElement } from '../../my-app/components/RenderElement';

type Props = {
  page: IPageTemplateVersion;
};
function DynamicPage({ page }: Props) {
  return <div>{<RenderElement node={page.vdom} />}</div>;
}
export default DynamicPage;
