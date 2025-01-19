'use server';

import clientMongoServer from '@/lib/mongo/initMongoServer';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { getMongoUser } from '@/lib/utils/auth/serverUtils';
import { clerkClient } from '@clerk/nextjs/server';

export async function updateOrganizationId(organizationId: string) {
  const user = await getMongoUser();

  await clientMongoServer.update(
    ENUM_COLLECTIONS.USERS,
    { _id: user._id },
    { $set: { organizationId } }
  );
  const client = await clerkClient();

  await client.users.updateUserMetadata(user.authId as string, {
    publicMetadata: {
      organizationId
    }
  });
  // update clerck user metadata
}
