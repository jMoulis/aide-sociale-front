import { clerkClient } from '@clerk/nextjs/server';
import { TableUsers } from './components/TableUsers';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import {
  getUsersListExcerpt,
  withOrganizationId
} from '@/lib/utils/auth/serverUtils';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { IUser } from '@/lib/interfaces/interfaces';

async function UsersPage() {
  const { data } = await withOrganizationId((organizationFilter) => {
    return clientMongoServer.list<IUser>(
      ENUM_COLLECTIONS.USERS,
      organizationFilter
    );
  });

  const usersIds =
    (data || [])
      .filter((user) => Boolean(user.authId))
      .map((user) => user.authId as string) || [];

  const client = await clerkClient();

  const { data: authUsers } = await client.users.getUserList({
    userId: usersIds
  });

  const users = await getUsersListExcerpt(authUsers);
  return <TableUsers data={users} />;
}

export default UsersPage;
