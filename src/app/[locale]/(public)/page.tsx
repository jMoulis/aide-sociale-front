import { IOrganization } from '@/lib/interfaces/interfaces';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { FormType } from '../admin/my-app/components/Builder/Components/FormContext';
import { Link } from '@/i18n/routing';

export default async function RootPage() {
  const { data: organizations } = await clientMongoServer.list<IOrganization>(
    ENUM_COLLECTIONS.ORGANIZATIONS
  );

  const test = await Promise.all(
    (organizations || []).map(async (organization) => {
      const collectionName = `${organization._id}_etablissements`;
      const { data: institutions } = await clientMongoServer.list<FormType>(
        collectionName as ENUM_COLLECTIONS,
        {
          organizationId: organization._id
        }
      );
      return {
        ...organization,
        institutions: institutions?.map((form) => form.data) || []
      };
    })
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
        {test?.map((organization) => (
          <li
            className='flex-1 mx-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm'
            key={organization._id}>
            <Link href={`/organization?organizationId=${organization._id}`}>
              <span>{organization.name}</span>
              <ul>
                {organization?.institutions?.map((institution, key) => (
                  <li key={key}>
                    <span>{institution.name}</span>
                    <span>{institution.places}</span>
                  </li>
                ))}
              </ul>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );

  // return routeSecurityMiddleware(ENUM_RESSOURCES.MY_WEBSITE, true, ({ menus }) => {
  //   return (
  //     <>
  //       {/* <MenuLayout menus={menus} />
  //       <MainLayout> */}
  //         <section className='flex-1'>{children}</section>
  //       {/* </MainLayout> */}
  //     </>
  //   );
  // });
}
