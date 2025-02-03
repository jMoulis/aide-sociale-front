import { getServerSideCurrentUserOrganizationId } from '@/lib/utils/auth/serverUtils';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { IWebsite } from '@/lib/interfaces/interfaces';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ENUM_APP_ROUTES } from '@/lib/interfaces/enums';

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
    <>
      <h1>My Websites</h1>
      <Link href={`${ENUM_APP_ROUTES.MY_APP}/create`}>Create</Link>
      <ul>
        {websites.map((website) => (
          <li key={website._id}>
            <Link href={`${ENUM_APP_ROUTES.MY_APP}/${website._id}`}>
              {website.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
