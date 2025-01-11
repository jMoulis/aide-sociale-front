import { ICollection } from '@/lib/interfaces/interfaces';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import {
  getMongoUser,
  getServerSideCurrentUserOrganizationId
} from '@/lib/utils/auth/serverUtils';
import Collections from './components/Collections';
import { getUserSummary } from '@/lib/utils/utils';

export default async function CollectionsPage() {
  const organizationId = await getServerSideCurrentUserOrganizationId();
  const { data: collections } = await clientMongoServer.list<ICollection>(
    ENUM_COLLECTIONS.COLLECTIONS,
    {
      organizationId
    }
  );
  const user = await getMongoUser();
  return (
    <Collections
      initialCollections={collections || []}
      organizationId={organizationId}
      user={getUserSummary(user)}
    />
  );
}
