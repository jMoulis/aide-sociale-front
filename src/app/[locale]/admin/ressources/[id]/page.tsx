import { getServerSideCurrentUserOrganizationId } from '@/lib/utils/auth/serverUtils';
import RessourceConfig from './components/RessourceConfig';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { IRessource } from '@/lib/interfaces/interfaces';

type Props = {
  params: Promise<{ id: string }>;
};
async function PageDetail({ params }: Props) {
  const { id } = await params;
  const organizationId = await getServerSideCurrentUserOrganizationId();
  const { data } = await clientMongoServer.get<IRessource>(
    ENUM_COLLECTIONS.RESSOURCES,
    { _id: id }
  );
  return (
    <RessourceConfig initialRessource={data} organizationId={organizationId} />
  );
}
export default PageDetail;
