import { getMongoUser } from '@/lib/utils/auth/serverUtils';
import RenderPage from '../app/RenderPage';
import {
  collectAsyncPayloads,
  getPublishedMasterTemplates,
  resolveTemplates
} from '../app/utils';
import { matchRoute } from '../app/matchRouter';
import { notFound } from 'next/navigation';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import { IMasterTemplate } from '@/lib/TemplateBuilder/interfaces';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import DynamicPage from '../app/components/DynamicPage';
import { IWebsite } from '@/lib/interfaces/interfaces';
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
export default async function RootPage({ searchParams }: any) {
  const { organizationId } = await searchParams;
  const user = await getMongoUser();
  const { data: organizationApp } = await clientMongoServer.get<IWebsite>(
    ENUM_COLLECTIONS.WEBSITES,
    {
      organizationId,
      published: true
    }
  );
  const files = organizationApp?.stylesheets || [];
  const compiledStylesheet = files.find(
    (stylesheet) => stylesheet.name === 'compiled'
  );

  const customHeaders = compiledStylesheet
    ? [
        <link
          key={compiledStylesheet.uri}
          rel='stylesheet'
          href={`${compiledStylesheet.uri}?v=${nanoid()}`}
        />
      ]
    : [];
  console.log(customHeaders);
  const { page, params } = await matchRoute([], organizationId);
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
  const datas = await collectAsyncPayloads(publishedVersion.vdom, params, {
    organizationId,
    userId: user._id,
    ...params
  });
  return (
    <DynamicPage
      page={publishedVersion}
      routeParams={params}
      asyncData={datas}
    />
  );
}
