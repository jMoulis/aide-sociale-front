import clientMongoServer from '@/lib/mongo/initMongoServer';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { getServerSideCurrentUserOrganizationId } from '@/lib/utils/auth/serverUtils';
import { IOrganization, ITeam } from '@/lib/interfaces/interfaces';
import OrganizationPage from './components/OrganizationPage';
import { redirect } from 'next/navigation';
import { ENUM_APP_ROUTES } from '@/lib/interfaces/enums';

export default async function OrganizationsHome() {
  const organizationId = await getServerSideCurrentUserOrganizationId();

  if (!organizationId) {
    redirect(`${ENUM_APP_ROUTES.ORGANIZATIONS}/create`);
  }

  const { data: prevOrganization } = await clientMongoServer.get<IOrganization>(
    ENUM_COLLECTIONS.ORGANIZATIONS,
    {
      _id: organizationId
    }
  );
  if (!prevOrganization) {
    redirect(`${ENUM_APP_ROUTES.ORGANIZATIONS}/create`);
  }
  const { data: organizationTeams } = await clientMongoServer.list<ITeam>(
    ENUM_COLLECTIONS.TEAMS,
    {
      organizationId
    }
  );
  return (
    <OrganizationPage
      prevOrganization={prevOrganization}
      teams={organizationTeams || []}
    />
  );
}
