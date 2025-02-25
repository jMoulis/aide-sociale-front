import { getServerSideCurrentUserOrganizationId } from '@/lib/utils/auth/serverUtils';
import { PagebuilderProvider } from '@/app/[locale]/admin/my-app/components/stores/pagebuilder-store-provider';
import WebsitePage from '../components/Website/WebsitePage';
import { breakPoints } from '../components/stores/pagebuilder-store';

export default async function CreatePage() {
  const organizationId = await getServerSideCurrentUserOrganizationId();

  return (
    <>
      <PagebuilderProvider
        selectedBreakPoint={{
          name: 'desktop',
          size: breakPoints.desktop
        }}
        elementConfig={null}
        pages={[]}
        website={null}
        masterTemplates={[]}
        pageTemplateVersions={[]}
        organizationId={organizationId}
        elementsConfig={[]}
        designMode={true}
        gridDisplay={false}
        selectedNode={null}
        selectedPage={null}
        selectedMasterTemplate={null}
        pageVersion={null}>
        <WebsitePage create />
      </PagebuilderProvider>
    </>
  );
}
