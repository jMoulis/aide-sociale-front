'use client';

import { IPageTemplateVersion } from '@/lib/interfaces/interfaces';
import RenderLayout from './RenderLayout';
import { FormType } from '../../my-app/components/Builder/Components/FormContext';

type Props = {
  page: IPageTemplateVersion;
  routeParams: Record<string, string>;
  forms: Record<string, FormType>;
};
function DynamicPage({ page, routeParams, forms }: Props) {
  return (
    <RenderLayout pageVersion={page} routeParams={routeParams} forms={forms} />
  );
}
export default DynamicPage;
