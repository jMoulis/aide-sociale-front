import {
  getMongoUser,
  getServerSideCurrentUserOrganizationId
} from '@/lib/utils/auth/serverUtils';
import { headers } from 'next/headers';
import { collectAsyncPayloads, getPublishedMasterTemplates } from './utils';
import { notFound } from 'next/navigation';
import MainLayout from '../components/MainLayout';
import { Link } from '@/i18n/routing';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import { IWebsite } from '@/lib/interfaces/interfaces';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import RenderLayout from './components/RenderLayout';

type Props = {
  slug: string[];
};
async function RenderPage({ slug }: Props) {
  const TEMPLATE_SEARCH_NAME = 'template';
  const user = await getMongoUser();
  const organizationId = await getServerSideCurrentUserOrganizationId();
  const headerList = await headers();
  // set in middleware
  const pathname = headerList.get('x-current-path');
  const searchParams = new URL(pathname || '').searchParams;
  const templateSearch = searchParams.get(TEMPLATE_SEARCH_NAME);
  const { data: organizationApp } = await clientMongoServer.get<IWebsite>(
    ENUM_COLLECTIONS.WEBSITES,
    {
      organizationId,
      published: true,
      public: { $ne: true }
    }
  );
  if (!organizationApp) {
    console.warn('No organization app found');
    notFound();
  }
  const { templates, routeParams } = await getPublishedMasterTemplates({
    slug,
    user,
    templateSearch,
    websiteId: organizationApp._id
  });

  if (templates.length === 0) {
    console.warn('No templates found for page', slug);
    notFound();
  }
  if (templates.length > 1) {
    return (
      <MainLayout>
        <ul>
          {templates.map((masterTemplate) => {
            if (!masterTemplate.publishedVersion) return null;
            return (
              <li key={masterTemplate._id}>
                <Link
                  href={`?${TEMPLATE_SEARCH_NAME}=${masterTemplate.publishedVersion._id}`}>
                  <h1>{masterTemplate.title}</h1>
                  <p>{masterTemplate.description}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </MainLayout>
    );
  }
  const publishedVersion = templates[0]?.publishedVersion;

  if (!publishedVersion) {
    console.warn('No published version');
    notFound();
  }

  const datas = await collectAsyncPayloads(publishedVersion.vdom, routeParams, {
    organizationId,
    userId: user._id,
    ...routeParams
  });

  return (
    <MainLayout>
      <RenderLayout
        pageVersion={publishedVersion}
        routeParams={{
          organizationId,
          userId: user._id,
          ...routeParams
        }}
        asyncData={datas}
      />
    </MainLayout>
  );
}
export default RenderPage;
