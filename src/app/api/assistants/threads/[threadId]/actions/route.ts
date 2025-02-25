import { client } from "@/lib/openAi/openAiClient";

// Send a new message to a thread
export async function POST(request: any, { params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params;
  const { toolCallOutputs, runId } = await request.json();
  const stream = client.beta.threads.runs.submitToolOutputsStream(
    threadId,
    runId,
    { tool_outputs: toolCallOutputs }
  );

  return new Response(stream.toReadableStream());
}