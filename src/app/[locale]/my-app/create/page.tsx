import { getServerSideCurrentUserOrganizationId } from '@/lib/utils/auth/serverUtils';
import { PagebuilderProvider } from '@/app/[locale]/my-app/components/stores/pagebuilder-store-provider';
import WebsitePage from '../components/Website/WebsitePage';

export default async function CreatePage() {
  const organizationId = await getServerSideCurrentUserOrganizationId();

  return (
    <>
      <PagebuilderProvider
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
