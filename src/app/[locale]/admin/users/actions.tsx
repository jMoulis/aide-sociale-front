'use server';

import { clerkClient, currentUser, User } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';

import clientMongoServer from '@/lib/mongo/initMongoServer';
import { nanoid } from 'nanoid';
import {
  getServerSideCurrentUserOrganizationId,
  getUsersListExcerpt
} from '@/lib/utils/auth/serverUtils';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { IUser, UserExcerpt } from '@/lib/interfaces/interfaces';
import { sortArray } from '@/lib/utils/utils';

export async function updateUserPassword(userId: string, password: string) {
  const tError = await getTranslations('ErrorSection');
  const tGlobal = await getTranslations('GlobalSection');
  const tSecurity = await getTranslations('SecuritySection');
  const tClerck = await getTranslations('clerk');

  if (!userId)
    return {
      title: tError('errorUserMissingId.title'),
      description: tError('errorUserMissingId.description'),
      variant: 'destructive',
      isError: true
    };
  try {
    const params = { password };
    const client = await clerkClient();
    await client.users.updateUser(userId, params);

    return {
      title: tGlobal('success'),
      description: tSecurity('passwordUpdated'),
      isError: false
    };
  } catch (error: any) {
    const clerkError = JSON.parse(JSON.stringify(error));
    if (clerkError.clerkError) {
      const { errors } = clerkError;
      return {
        title: tError('errorPasswordUpdate.title'),
        description: errors
          .map((error: any) => tClerck(`errors.${error.code}` as any))
          .join(', '),
        isError: true,
        variant: 'destructive'
      };
    }
    return {
      title: tError('errorPasswordUpdate.title'),
      description: error.message,
      isError: true,
      variant: 'destructive'
    };
  }
}
export async function banUser(userId: string, isBanned: boolean) {
  const tError = await getTranslations('ErrorSection');
  const tGlobal = await getTranslations('GlobalSection');
  const tSecurity = await getTranslations('SecuritySection');
  const tClerck = await getTranslations('clerk');

  const contextualTranslation = (translationKey: string, props?: any) => {
    const root = isBanned ? 'unbanUser' : 'banUser';
    return tSecurity(`${root}.${translationKey}` as any, props);
  };

  if (!userId)
    return {
      title: tError('errorUserMissingId.title'),
      description: tError('errorUserMissingId.description'),
      variant: 'destructive',
      isError: true
    };
  try {
    const client = await clerkClient();
    if (isBanned) {
      await client.users.unbanUser(userId);
    } else {
      await client.users.banUser(userId);
    }
    return {
      title: tGlobal('success'),
      description: contextualTranslation('success'),
      isError: false
    };
  } catch (error: any) {
    const clerkError = JSON.parse(JSON.stringify(error));
    if (clerkError.clerkError) {
      const { errors } = clerkError;
      return {
        title: contextualTranslation('title'),
        description: errors
          .map((error: any) => tClerck(`errors.${error.code}` as any))
          .join(', '),
        isError: true,
        variant: 'destructive'
      };
    }
    return {
      title: isBanned ? tError('unbanUser.title') : tError('banUser.title'),
      description: error.message,
      isError: true,
      variant: 'destructive'
    };
  }
}

export async function deleteUser(userId: string) {
  const tError = await getTranslations('ErrorSection');
  const tGlobal = await getTranslations('GlobalSection');
  const tSecurity = await getTranslations('SecuritySection');
  const client = await clerkClient();

  if (!userId)
    return {
      title: tError('errorUserMissingId.title'),
      description: tError('errorUserMissingId.description'),
      variant: 'destructive',
      isError: true
    };
  try {
    await client.users.deleteUser(userId);
    clientMongoServer
      .get<IUser>(ENUM_COLLECTIONS.USERS, {
        authId: userId
      })
      .then(({ data }) => {
        if (!data?._id) return;
        clientMongoServer.delete(ENUM_COLLECTIONS.USERS, data._id);
      });
    return {
      title: tGlobal('success'),
      description: tSecurity('delete.success'),
      isError: false
    };
  } catch (error: any) {
    return {
      title: tGlobal('error'),
      description: tSecurity.rich('delete.error', {
        error: error.message,
        code: (chunks) => <code>{chunks}</code>
      }),
      isError: true
    };
  }
}

export async function getUserList() {
  const tGlobal = await getTranslations('GlobalSection');
  const tSecurity = await getTranslations('SecuritySection');

  try {
    const client = await clerkClient();
    const { data } = await client.users.getUserList();
    const organizationId = await getServerSideCurrentUserOrganizationId();
    const filteredUsersByOrganization = sortArray(
      data.filter((user: User) => {
        return user.publicMetadata?.organizationId === organizationId;
      }),
      'firstName'
    );
    const users: UserExcerpt[] = await getUsersListExcerpt(
      filteredUsersByOrganization
    );

    return {
      data: users
    };
  } catch (error: any) {
    return {
      title: tGlobal('error'),
      description: tSecurity.rich('getUsers.error', {
        error: error.message,
        code: (chunks) => <code>{chunks}</code>
      }),
      isError: true
    };
  }
}

type CreateUserProps = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};
export async function createUser({
  email,
  password,
  firstName,
  lastName
}: CreateUserProps) {
  const tError = await getTranslations('ErrorSection');
  const tGlobal = await getTranslations('GlobalSection');
  const tClerk = await getTranslations('clerk');
  const tUsersPage = await getTranslations('UserSection');
  const authUser = await currentUser();
  try {
    if (!authUser) throw Error('User not found. Please log in and try again.');
    const client = await clerkClient();

    const createdAuthUser = await client.users.createUser({
      emailAddress: [email],
      password,
      firstName,
      lastName
    });
    await client.users.updateUserMetadata(createdAuthUser.id, {
      publicMetadata: {
        organizationId: await getServerSideCurrentUserOrganizationId()
      }
    });
    const userId = nanoid();

    await clientMongoServer.create<IUser>(ENUM_COLLECTIONS.USERS, {
      _id: userId,
      email,
      firstName,
      lastName,
      authId: createdAuthUser.id,
      imageUrl: createdAuthUser.imageUrl,
      roles: [],
      organizationId: await getServerSideCurrentUserOrganizationId(),
      createdAt: new Date()
    });
    return {
      title: tUsersPage('create.title'),
      description: tUsersPage('create.success')
    };
  } catch (error: any) {
    const clerkError = JSON.parse(JSON.stringify(error));
    if (clerkError.clerkError) {
      const { errors } = clerkError;
      return {
        title: tError('errorPasswordUpdate.title'),
        description: errors
          .map((error: any) => tClerk(`errors.${error.code}` as any))
          .join(', '),
        isError: true,
        variant: 'destructive'
      };
    }
    return {
      title: tGlobal('error'),
      description: tUsersPage.rich('create.error', {
        error: error.message,
        code: (chunks) => <code>{chunks}</code>
      }),
      isError: true
    };
  }
}

export async function updateUser(
  userId: string,
  params: { firstName: string; lastName: string }
) {
  const tError = await getTranslations('ErrorSection');
  const tClerk = await getTranslations('clerk');
  const tProfilePage = await getTranslations('ProfileSection');

  if (!userId)
    return {
      title: tError('errorUserMissingId.title'),
      description: tError('errorUserMissingId.description'),
      variant: 'destructive',
      isError: true
    };
  try {
    const client = await clerkClient();
    await client.users.updateUser(userId, params);

    return {
      title: tProfilePage('edit.description'),
      description: tProfilePage('edit.success'),
      isError: false
    };
  } catch (error: any) {
    const clerkError = JSON.parse(JSON.stringify(error));
    if (clerkError.clerkError) {
      const { errors } = clerkError;
      return {
        title: tProfilePage('edit.error'),
        description: errors
          .map((error: any) => tClerk(`errors.${error.code}` as any))
          .join(', '),
        isError: true,
        variant: 'destructive'
      };
    }
    return {
      title: tProfilePage('edit.title'),
      description: error.message,
      isError: true,
      variant: 'destructive'
    };
  }
}
