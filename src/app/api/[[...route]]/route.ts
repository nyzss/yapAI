import { Hono } from "hono";
import { handle } from "hono/vercel";
import { CoreMessage, streamText } from "ai";
import { openai } from "@ai-sdk/openai";

const app = new Hono().basePath("/api").post("/chat", async (c) => {
  const { messages }: { messages: CoreMessage[] } = await c.req.json();

  const response = streamText({
    model: openai("gpt-4o-mini"),
    messages,
  });

  return response.toDataStreamResponse();
});

export const AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
