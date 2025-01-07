

import clientMongoServer from '@/lib/mongo/initMongoServer';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { v4 } from 'uuid';

export interface ISignupApiBody {
  authId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export async function POST(req: Request) {
  const payload = await req.json();
  const { authId, email, firstName, lastName } = payload as ISignupApiBody;
  const client = await clerkClient();
  try {
    const userData = {
      firstName,
      lastName,
      roles: [],
      authId,
      teams: [],
      imageUrl: '',
      email
    }
    const userId = v4();
    const response = await clientMongoServer.upsertServer(ENUM_COLLECTIONS.USERS, { _id: userId }, { $set: userData });

    if (response.error) {
      await client.users.deleteUser(authId);
      return NextResponse.json({
        message: `MongoDB user creation failed, ${response.error}`,
      }, { status: 500 })
    }

    if (userId) {
      // await client.users.updateUserMetadata(authId, {
      //   publicMetadata: {
      //     organizationId
      //   }
      // });

      // await clientMongoServer.upsertServer(ENUM_COLLECTIONS.USERS, { _id: userId }, {
      //   $set: {
      //     organizationId,
      //   }
      // });
    }
    return NextResponse.json({
      message: 'MongoDB user created',
    }, { status: 200 });
  } catch (error: any) {
    await client.users.deleteUser(authId);
    return NextResponse.json({
      message: `MongoDB user creation failed, ${error.message}`,
    }, { status: 500 })
  }
}
