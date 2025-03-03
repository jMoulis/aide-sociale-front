import { ICollection } from '@/lib/interfaces/interfaces';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { getServerSideCurrentUserOrganizationId } from '@/lib/utils/auth/serverUtils';
import Collections from './components/Collections';

export default async function CollectionsPage() {
  const organizationId = await getServerSideCurrentUserOrganizationId();
  const { data: collections } = await clientMongoServer.list<ICollection>(
    ENUM_COLLECTIONS.COLLECTIONS,
    {
      organizationId
    }
  );
  return <Collections initialCollections={collections || []} />;
}
