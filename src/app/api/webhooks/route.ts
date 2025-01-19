/* eslint-disable no-console */
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import client from '@/lib/mongo/initMongoServer';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';

export async function POST(req: Request) {
  console.log('Webhook received');
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Could not verify webhook:', err)
    return new Response('Verification error', {
      status: 400,
    });
  }

  // Do something with payload
  // For this guide, log payload to console
  const updatedUser = evt.data as any;
  const eventType = evt.type;
  if (eventType === 'user.deleted') {
    console.log('User deleted:', updatedUser.id);
    try {
      await client.deleteClerkWebhook(ENUM_COLLECTIONS.USERS, updatedUser.id);
    } catch (error) {
      console.log('Error deleting user:', error);
    }
  }
  return new Response('Webhook received', { status: 200 })
}