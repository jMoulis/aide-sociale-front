import { client } from "@/lib/openAi/openAiClient";
import { assistantId } from "@/lib/openAi/assistant-config";

export const runtime = "nodejs";

// Send a new message to a thread
export async function POST(request: any, { params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params;
  const { content } = await request.json();

  await client.beta.threads.messages.create(threadId, {
    role: "user",
    content: content,
  });

  const stream = client.beta.threads.runs.stream(threadId, {
    assistant_id: assistantId,
  });

  return new Response(stream.toReadableStream());
}