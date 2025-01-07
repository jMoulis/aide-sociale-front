import { clerkClient } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import DetailUser from './components/DetailUser';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import {
  getUserExcerpt,
  withOrganizationId
} from '@/lib/utils/auth/serverUtils';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { IRole } from '@/lib/interfaces/interfaces';

type Props = {
  params: Promise<{
    id: string;
  }>;
};
async function UserDetailPage({ params }: Props) {
  const userId = (await params).id;
  if (!userId) {
    notFound();
  }
  const { data: mongoUser } = await clientMongoServer.getConnectedMongoUser(
    { authId: userId },
    {
      project: {
        roles: 1,
        _id: 1,
        authId: 1
      }
    }
  );
  if (!mongoUser) {
    notFound();
  }
  const client = await clerkClient();

  const fetchUser = await client.users.getUser(userId);

  if (!fetchUser) notFound();

  const { data: roles } = await withOrganizationId((organizationFilter) =>
    clientMongoServer.list<IRole>(ENUM_COLLECTIONS.ROLES, organizationFilter)
  );

  const userExcerpt = await getUserExcerpt(fetchUser);
  if (!userExcerpt) {
    notFound();
  }
  return (
    <DetailUser
      userServer={userExcerpt}
      mongoUser={mongoUser}
      roles={roles || []}
    />
  );
}

export default UserDetailPage;
