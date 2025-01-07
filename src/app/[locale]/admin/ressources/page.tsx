import client from '@/lib/mongo/initMongoServer';
import TableRessources from './components/TableRessources';
import { withOrganizationId } from '@/lib/utils/auth/serverUtils';
import { IRessource } from '@/lib/interfaces/interfaces';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import ErrorDefault from '../../components/ErrorDefault';

async function RessourcesPage() {
  const { data: initialRessources, error } = await withOrganizationId(
    (organizationFilter) =>
      client.list<IRessource>(ENUM_COLLECTIONS.RESSOURCES, organizationFilter)
  );
  if (error) {
    return <ErrorDefault message={error} />;
  }
  return <TableRessources initialRessources={initialRessources || []} />;
}

export default RessourcesPage;
