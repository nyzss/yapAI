import { Hono } from "hono";
import { Message, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { HonoType } from "../route";
import { db } from "@/db";
import { chatsTable } from "@/db/schema";

export const chatRoute = new Hono<HonoType>()
  .post("/", async (c) => {
    const { messages }: { messages: Message[] } = await c.req.json();

    const response = streamText({
      model: openai("gpt-4o-mini"),
      messages,
    });

    return response.toDataStreamResponse();
  })
  .post("/create", async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [chat] = await db
      .insert(chatsTable)
      .values({
        userId: user.id,
        folderId: null,
        title: "New Chat",
      })
      .returning();

    return c.json({ chat });
  });
