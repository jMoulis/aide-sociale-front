import { getServerSideCurrentUserOrganizationId } from '@/lib/utils/auth/serverUtils';
import StructureForm from '../components/StructureForm';

export default async function Home() {
  const organizationId = await getServerSideCurrentUserOrganizationId();
  return (
    <div>
      <StructureForm prevStructure={null} organizationId={organizationId} />
    </div>
  );
}
