import { IOrganization } from '@/lib/interfaces/interfaces';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { Link } from '@/i18n/routing';

export default async function RootPage() {
  const { data: organizations } = await clientMongoServer.list<IOrganization>(
    ENUM_COLLECTIONS.ORGANIZATIONS
  );
  return (
    <>
      <header>
        <nav>
          <div>
            <h1>Organizations</h1>
          </div>
        </nav>
      </header>
      <ul className='flex'>
        {organizations?.map((organization) => (
          <li
            className='flex-1 mx-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm'
            key={organization._id}>
            <Link href={`/organization?organizationSlug=${organization.slug}`}>
              <span>{organization.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
