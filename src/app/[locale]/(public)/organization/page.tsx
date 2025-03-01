import { IOrganization, IWebsite } from '@/lib/interfaces/interfaces';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { matchRoute } from '../../app/matchRouter';
import { notFound } from 'next/navigation';
import { IMasterTemplate } from '@/lib/TemplateBuilder/interfaces';
import { collectAsyncPayloads } from '../../app/utils/utils';
import { getMongoUser } from '@/lib/utils/auth/serverUtils';
import RenderLayout from '../../app/components/RenderLayout';
import { nanoid } from 'nanoid';

const fetchTemplateVersions = async (templateId: string) => {
  const { data: masterTemplates } =
    await clientMongoServer.list<IMasterTemplate>(
      ENUM_COLLECTIONS.TEMPLATES_MASTER,
      { _id: templateId, public: true, publishedVersion: { $exists: true } }
    );
  if (!masterTemplates?.length) {
    notFound();
  }
  return masterTemplates.filter(
    (masterTemplate) => !!masterTemplate.publishedVersion
  );
};

type Props = {
  searchParams: Promise<{ organizationSlug: string }>;
};
export default async function RootPage({ searchParams }: Props) {
  const { organizationSlug } = await searchParams;
  const user = await getMongoUser();

  const { data: organization } = await clientMongoServer.get<IOrganization>(
    ENUM_COLLECTIONS.ORGANIZATIONS,
    {
      slug: organizationSlug
    }
  );

  if (!organization) {
    notFound();
  }
  const { data: organizationApp } = await clientMongoServer.get<IWebsite>(
    ENUM_COLLECTIONS.WEBSITES,
    {
      organizationId: organization._id,
      published: true,
      public: true
    }
  );
  if (!organizationApp) {
    notFound();
  }
  const files = organizationApp?.stylesheets || [];
  const compiledStylesheet = files.find(
    (stylesheet) => stylesheet.name === 'compiled'
  );

  const { page, params } = await matchRoute(
    [],
    organization._id,
    organizationApp._id
  );
  if (!page) {
    notFound();
  }
  const masterTemplates = await Promise.all(
    page.masterTemplateIds.map((masterTemplateId) =>
      fetchTemplateVersions(masterTemplateId)
    )
  );
  const flatTemplates = masterTemplates.flat();

  const publishedVersion = flatTemplates[0]?.publishedVersion;

  if (!publishedVersion) {
    notFound();
  }
  const datas = await collectAsyncPayloads(
    publishedVersion.vdom,
    params,
    {
      organizationId: organization._id,
      userId: user._id,
      ...params
    },
    publishedVersion?.stores || []
  );
  return (
    <>
      {compiledStylesheet ? (
        <link
          rel='stylesheet'
          href={`${compiledStylesheet.uri}?v=${nanoid()}`}
          title={compiledStylesheet.name}
        />
      ) : null}
      <RenderLayout
        pageVersion={publishedVersion}
        routeParams={{
          organizationId: organization._id,
          userId: user._id,
          ...params
        }}
        asyncData={datas}
      />
    </>
  );
}
