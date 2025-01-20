'use client';

import MasterTemplateForm from './MasterTemplateForm';
import { IUserSummary } from '@/lib/interfaces/interfaces';
import { PageBuilderEditor } from './PageBuilderEditor';
import { usePageBuilderStore } from './usePageBuilderStore';
import PageTemplateVersionsList from './PageTemplateVersionsList';
import MasterTemplatesList from './MasterTemplatesList';

type Props = {
  user: IUserSummary;
};
function TemplateMasters({ user }: Props) {
  const selectedVersionPage = usePageBuilderStore((state) => state.pageVersion);

  return (
    <div>
      <PageBuilderEditor />
      {!selectedVersionPage ? (
        <>
          <MasterTemplateForm user={user} />
          <MasterTemplatesList user={user} />
          <PageTemplateVersionsList />
        </>
      ) : null}
    </div>
  );
}
export default TemplateMasters;
