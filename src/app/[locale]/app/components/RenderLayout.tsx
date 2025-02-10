import React from 'react';
import { IPageTemplateVersion } from '@/lib/interfaces/interfaces';
import { FormProvider } from '../../my-app/components/Builder/Components/FormContext';
import { renderVNode } from '../../my-app/components/Builder/Components/renderVode';

interface RenderLayoutProps {
  pageVersion: IPageTemplateVersion;
  routeParams?: any;
  forms: Record<string, any>;
}

export default function RenderLayout({
  pageVersion,
  forms
}: RenderLayoutProps) {
  // Start with the root node's ID in the path array (or "root" if missing)
  const rootNode = pageVersion.vdom;
  const initialId = rootNode._id || 'root';
  const initialPath = [initialId];

  return (
    <FormProvider forms={forms}>
      {renderVNode(rootNode, initialPath)}
    </FormProvider>
  );
}
