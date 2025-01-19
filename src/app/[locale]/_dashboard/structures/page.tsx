import { Link } from '@/i18n/routing';
import { ENUM_APP_ROUTES } from '@/lib/interfaces/enums';
import { IStructure } from '@/lib/interfaces/interfaces';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { getServerSideCurrentUserOrganizationId } from '@/lib/utils/auth/serverUtils';

export default async function StructuresPage() {
  const organizationId = await getServerSideCurrentUserOrganizationId();
  const { data: structures } = await clientMongoServer.list<IStructure>(
    ENUM_COLLECTIONS.STRUCTURES,
    { organizationId }
  );
  return (
    <main>
      <h1>List établissements</h1>
      <Link href={`${ENUM_APP_ROUTES.STRUCTURES}/create`}>New</Link>
      {structures?.map((structure) => (
        <div key={structure._id}>
          <Link href={`${ENUM_APP_ROUTES.STRUCTURES}/${structure._id}`}>
            {structure.name}
          </Link>
        </div>
      ))}
    </main>
  );
}
