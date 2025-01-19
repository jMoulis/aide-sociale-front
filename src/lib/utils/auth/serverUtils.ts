
'use server';

import { ActionKey, ENUM_APP_ROUTES } from '@/lib/interfaces/enums';
import { UserExcerpt } from '@/lib/interfaces/interfaces';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import { currentUser, User } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';

export const hasPermissions = async (userRoutePermissions: ActionKey[] | null, routeMandatoryPermissions: ActionKey[], shouldFullyMatch: boolean) => {
  if (!userRoutePermissions) {
    return false;
  }
  if (shouldFullyMatch) {
    return (
      userRoutePermissions.length >= routeMandatoryPermissions.length &&
      routeMandatoryPermissions.every((permission) => userRoutePermissions.includes(permission))
    );
  }

  return routeMandatoryPermissions.some((permission) => (userRoutePermissions).includes(permission));
};

export const getUserExcerpt = async (user: User): Promise<UserExcerpt | null> => {
  return {
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress || null,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
    lastSignInAt: user.lastSignInAt || 0,
    joinedAt: user.createdAt,
    isBanned: user.banned,
    organizationId: await getServerSideCurrentUserOrganizationId()
  }
}

export const getUsersListExcerpt = async (users: User[]): Promise<UserExcerpt[]> => {
  const result: UserExcerpt[] = [];

  for (const user of users) {
    const userExcerpt = await getUserExcerpt(user);
    if (userExcerpt) {
      result.push(userExcerpt);
    }
  }

  return result;
};

export const getServerSideCurrentUserOrganizationId: () => Promise<string> = async () => {
  const authUser = await currentUser();
  return authUser?.publicMetadata?.organizationId || "undefined";
}

type WithOrganizationIdCallback<T> = (organizationFilter: { organizationId: string }) => Promise<T>;

export async function withOrganizationId<T>(callback: WithOrganizationIdCallback<T>): Promise<T> {
  const organizationId = await getServerSideCurrentUserOrganizationId();

  return callback({ organizationId });
}

export async function getMongoUser() {
  try {
    const authUser = await currentUser();
    if (!authUser) {
      redirect(ENUM_APP_ROUTES.SIGN_IN);
    }

    const { data: mongoUser, error } =
      await clientMongoServer.getConnectedMongoUser(
        { authId: authUser.id },
        {
          project: {
            roles: 1,
            _id: 1,
            authId: 1
          }
        }
      );

    if (!mongoUser || error) {
      redirect(ENUM_APP_ROUTES.SIGN_IN);
    }

    return mongoUser;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    redirect(ENUM_APP_ROUTES.SIGN_IN);
  }
}