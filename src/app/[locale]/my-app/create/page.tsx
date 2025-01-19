import {
  getMongoUser,
  getServerSideCurrentUserOrganizationId
} from '@/lib/utils/auth/serverUtils';
import { getUserSummary } from '@/lib/utils/utils';
import WebsitePage from '../components/WebsiteForm';

export default async function WebsiteCreatePage() {
  const organizationId = await getServerSideCurrentUserOrganizationId();
  const mongoUser = await getMongoUser();

  const excerptUser = getUserSummary(mongoUser);
  return (
    <>
      <h1>My website</h1>
      <WebsitePage organizationId={organizationId} user={excerptUser} create />
    </>
  );
}
