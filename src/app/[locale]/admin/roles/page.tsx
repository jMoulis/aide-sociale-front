import client from '@/lib/mongo/initMongoServer';
import TableRoles from './components/TableRoles';

import { currentUser } from '@clerk/nextjs/server';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { IRole } from '@/lib/interfaces/interfaces';
import ErrorDefault from '../../components/ErrorDefault';

async function RolesPage() {
  const userOrganizationId = (await currentUser())?.publicMetadata
    ?.organizationId;

  const { data: initialRoles, error } = await client.list<IRole>(
    ENUM_COLLECTIONS.ROLES,
    { organizationId: userOrganizationId } as Partial<IRole>
  );
  if (error) {
    return <ErrorDefault message={error} />;
  }
  return <TableRoles initialRoles={initialRoles || []} />;
}

export default RolesPage;
