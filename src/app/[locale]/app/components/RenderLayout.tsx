import React from 'react';
import {
  AsyncPayloadMap,
  IPageTemplateVersion
} from '@/lib/interfaces/interfaces';
import { FormProvider } from '../../admin/my-app/components/Builder/Components/FormContext';
import { renderVNode } from '../../admin/my-app/components/Builder/Components/renderVode';

interface RenderLayoutProps {
  pageVersion: IPageTemplateVersion;
  routeParams?: any;
  asyncData: AsyncPayloadMap;
}

export default function RenderLayout({
  pageVersion,
  asyncData,
  routeParams
}: RenderLayoutProps) {
  // Start with the root node's ID in the path array (or "root" if missing)
  const rootNode = pageVersion.vdom;
  const initialId = rootNode._id || 'root';
  const initialPath = [initialId];

  return (
    <FormProvider asyncData={asyncData}>
      {renderVNode(rootNode, initialPath, routeParams)}
    </FormProvider>
  );
}
