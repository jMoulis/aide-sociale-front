import { getServerSideCurrentUserOrganizationId } from '@/lib/utils/auth/serverUtils';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { IWebsite } from '@/lib/interfaces/interfaces';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ENUM_APP_ROUTES } from '@/lib/interfaces/enums';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

export default async function WebsitesPage() {
  const organizationId = await getServerSideCurrentUserOrganizationId();
  const { data: websites } = await clientMongoServer.list<IWebsite>(
    ENUM_COLLECTIONS.WEBSITES,
    {
      organizationId
    }
  );

  if (!websites) {
    notFound();
  }
  return (
    <section
      style={{
        gridArea: 'main',
        display: 'flex'
      }}>
      <aside>
        <h1>My Websites</h1>
        <Link href={`${ENUM_APP_ROUTES.MY_APP}/create`}>Create</Link>
      </aside>
      <ul className='flex flex-wrap'>
        {websites.map((website) => (
          <li key={website._id} className='m-2'>
            <Link href={`${ENUM_APP_ROUTES.MY_APP}/${website._id}`}>
              <Card>
                <CardHeader>
                  <CardTitle>{website.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Crée le: {format(website.createdAt, 'dd/MM/yyyy')}</p>
                  <p>
                    Dernière mise à jour le:
                    {format(
                      website.updatedAt ?? website.createdAt,
                      'dd/MM/yyyy'
                    )}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
