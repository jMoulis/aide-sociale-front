import { getServerSideCurrentUserOrganizationId } from '@/lib/utils/auth/serverUtils';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import {
  IPage,
  IPageTemplateVersion,
  IWebsite
} from '@/lib/interfaces/interfaces';
import { notFound } from 'next/navigation';
import WebsitePage from '../components/Website/WebsitePage';
import { PagebuilderProvider } from '../components/stores/pagebuilder-store-provider';
import { IMasterTemplate } from '@/lib/TemplateBuilder/interfaces';
import { breakPoints } from '../components/stores/pagebuilder-store';

type Props = {
  params: Promise<{ websiteId: string }>;
};
export default async function WebsiteDetailPage({ params }: Props) {
  const { websiteId } = await params;
  const organizationId = await getServerSideCurrentUserOrganizationId();

  const { data: initialWebsite } = await clientMongoServer.get<IWebsite>(
    ENUM_COLLECTIONS.WEBSITES,
    {
      _id: websiteId
    }
  );
  if (!initialWebsite) {
    notFound();
  }
  const { data: websitePages } = await clientMongoServer.list<IPage>(
    ENUM_COLLECTIONS.PAGES,
    {
      websiteId: initialWebsite._id
    }
  );

  const masterTemplateIds =
    websitePages?.map((page) => page.masterTemplateIds).flat() || [];
  const { data: masterTemplates } =
    await clientMongoServer.list<IMasterTemplate>(
      ENUM_COLLECTIONS.TEMPLATES_MASTER,
      {
        _id: {
          $in: masterTemplateIds
        }
      }
    );

  const { data: versions } = await clientMongoServer.list<IPageTemplateVersion>(
    ENUM_COLLECTIONS.PAGE_TEMPLATES,
    {
      masterTemplateId: {
        $in: masterTemplates?.map((template) => template._id)
      }
    }
  );
  const firstPage = websitePages?.[0];

  const masterTemplate = masterTemplates?.find((template) =>
    firstPage?.masterTemplateIds?.includes(template._id)
  );
  const puublishedVersion = versions?.find(
    (version) =>
      version.masterTemplateId === masterTemplate?._id && version.published
  );
  return (
    <>
      <PagebuilderProvider
        selectedBreakPoint={{
          name: 'desktop',
          size: breakPoints.desktop
        }}
        elementConfig={null}
        pages={websitePages || []}
        website={initialWebsite}
        masterTemplates={masterTemplates || []}
        pageTemplateVersions={versions || []}
        organizationId={organizationId}
        elementsConfig={[]}
        designMode={true}
        gridDisplay={true}
        selectedNode={null}
        selectedPage={firstPage || null}
        selectedMasterTemplate={masterTemplate || null}
        pageVersion={puublishedVersion || null}>
        <WebsitePage />
      </PagebuilderProvider>
    </>
  );
}
