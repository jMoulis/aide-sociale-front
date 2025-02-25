import { client } from "@/lib/openAi/openAiClient";

export const runtime = "nodejs";

// Create a new thread
export async function POST() {
  const thread = await client.beta.threads.create();
  return Response.json({ threadId: thread.id });
}