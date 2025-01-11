import client from '@/lib/mongo/initMongoServer';
import TableRessources from './components/TableRessources';
import { withOrganizationId } from '@/lib/utils/auth/serverUtils';
import { IRessource } from '@/lib/interfaces/interfaces';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import ErrorDefault from '../../components/ErrorDefault';
import { sortArray } from '@/lib/utils/utils';

async function RessourcesPage() {
  const { data: initialRessources, error } = await withOrganizationId(
    (organizationFilter) =>
      client.list<IRessource>(ENUM_COLLECTIONS.RESSOURCES, organizationFilter)
  );
  if (error) {
    return <ErrorDefault message={error} />;
  }
  return (
    <TableRessources
      initialRessources={sortArray(initialRessources || [], 'name')}
    />
  );
}

export default RessourcesPage;
