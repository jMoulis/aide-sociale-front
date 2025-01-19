/* eslint-disable no-console */
import { IRole } from '@/lib/interfaces/interfaces';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log('Webhook received');
  const xWebhookToken = req.headers.get('x-webhook-token');
  const payload = await req.json();
  if (payload.operationType === 'update') {
    console.log('Starting role update webhook');
    const role = payload.fullDocument;

    if (!role?._id) {
      return NextResponse.json({ message: 'Role document not found on update', error: 'Role misconfigured' }, { status: 404 })
    }

    try {
      const { data, error } = await clientMongoServer
        .updateMany<{ _id: string, roles: IRole[], authId: string }>(ENUM_COLLECTIONS.USERS,
          {},
          {
            $set: { 'roles.$[elem]': role }
          }, {
          arrayFilters: [{ 'elem._id': role._id }]
        },
          xWebhookToken
        );

      if (error) {
        console.error('Error updating users after role update', error)
        return NextResponse.json({
          message: 'Webhook unknown error',
          error
        }, { status: 400 })
      }
      console.log('Users updated after role update');
      if (!data) {
        return NextResponse.json({ status: 404, message: 'No users found to update' }, { status: 404 })
      }

      return NextResponse.json({ status: 200, message: data, }, { status: 200 });
    } catch (error: any) {
      console.error('Error updating users after role update', error)
      return NextResponse.json({
        message: 'Webhook unknown error',
        error
      }, { status: 400 })
    }
  }

  if (payload.operationType === 'delete') {
    const deletedDocumentId = payload.documentKey._id as string;

    try {
      const { data } = await clientMongoServer
        .updateMany<{ _id: string, roles: IRole[], authId: string }>(ENUM_COLLECTIONS.USERS,
          { "roles._id": deletedDocumentId },
          {
            $pull: {
              roles: {
                _id: deletedDocumentId
              }
            }
          });
      if (!data) {
        return NextResponse.json({ message: 'No users found to update after role deletion' }, { status: 404 })
      }

      console.log('Users updated after role deletion');
      return NextResponse.json({ message: 'Users updated after role deletion', data }, { status: 200 })
    } catch (error: any) {
      console.error('Error updating users after role deletion', error)
      return NextResponse.json({ message: 'Unable to process update after role deletion' }, { status: 500 })
    }
  }
  return NextResponse.json({
    message: 'Webhook roles processed',
  }, { status: 200 })
}



/**
 * {
  "_id": "6755664e7432afa0d90852d2",
  "description": "",
  "name": "NewRôleTest",
  "permissions": {
    "admin": [
      "DELETE"
    ],
    "roles": [
      "DELETE"
    ],
    "users": [
      "DELETE"
    ],
    "ressources": [
      "DELETE"
    ]
  }
}
 */