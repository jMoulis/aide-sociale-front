import {
  getMongoUser,
  getServerSideCurrentUserOrganizationId
} from '@/lib/utils/auth/serverUtils';
import { getUserSummary } from '@/lib/utils/utils';
import WebsitePage from './components/WebsiteForm';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { IWebsite } from '@/lib/interfaces/interfaces';

export default async function TemplatePage() {
  const organizationId = await getServerSideCurrentUserOrganizationId();
  const mongoUser = await getMongoUser();

  const excerptUser = getUserSummary(mongoUser);
  const { data: initialWebsite } = await clientMongoServer.get<IWebsite>(
    ENUM_COLLECTIONS.WEBSITES,
    {
      organizationId
    }
  );
  return (
    <>
      <h1>My website</h1>
      <WebsitePage
        organizationId={organizationId}
        user={excerptUser}
        initialWebsite={initialWebsite}
      />
    </>
  );
}
