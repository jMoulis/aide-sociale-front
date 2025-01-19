import { getServerSideCurrentUserOrganizationId } from '@/lib/utils/auth/serverUtils';
import RessourceConfig from '../[id]/components/RessourceConfig';

async function PageDetail() {
  const organizationId = await getServerSideCurrentUserOrganizationId();
  return (
    <RessourceConfig initialRessource={null} organizationId={organizationId} />
  );
}
export default PageDetail;
