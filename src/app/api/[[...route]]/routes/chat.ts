import { Hono } from "hono";
import { appendClientMessage, AssistantMessage, Message, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { HonoType } from "../route";
import { db } from "@/db";
import { chatsTable, messagesTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const getChat = async ({ id, userId }: { id: string; userId: string }) => {
  const chat = await db.query.chatsTable.findFirst({
    where: and(eq(chatsTable.id, id), eq(chatsTable.userId, userId)),
    with: {
      messages: true,
    },
  });

  return chat;
};

const handleChat = async ({ id, userId }: { id: string; userId: string }) => {
  const chat = await getChat({ id, userId });

  if (chat) {
    return chat;
  }

  const [newChat] = await db
    .insert(chatsTable)
    .values({
      id,
      userId,
      folderId: null,
      title: "New Chat",
    })
    .returning({
      id: chatsTable.id,
    });

  const createdChat = await getChat({ id: newChat.id, userId });

  if (!createdChat) {
    throw new Error("Chat not found");
  }

  return createdChat;
};

export const chatRoute = new Hono<HonoType>()
  .get("/:id", zValidator("param", z.object({ id: z.string() })), async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { id } = c.req.valid("param");

    const chat = await db.query.chatsTable.findFirst({
      where: and(eq(chatsTable.id, id), eq(chatsTable.userId, user.id)),
      with: {
        messages: true,
      },
    });

    if (!chat) {
      return c.json({ error: "Chat not found" }, 404);
    }

    return c.json({ chat, error: null });
  })
  .post(
    "/",

    async (c) => {
      const user = c.get("user");

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const { message, id }: { message: Message; id: string } =
        await c.req.json();

      const chat = await handleChat({ id, userId: user.id });

      const previousMessages = chat.messages.map((m) => m.content as Message);

      const messages = appendClientMessage({
        message: message,
        messages: previousMessages,
      });

      await db.insert(messagesTable).values({
        userId: user.id,
        content: message,
        chatId: chat.id,
      });

      const response = streamText({
        model: openai("gpt-4o-mini"),
        messages,
        async onFinish({ response }) {
          console.log("RESPONSE", response);
          await db.insert(messagesTable).values(
            response.messages.map((m) => {
              console.log("M", m);
              const message: Message = {
                ...(m as Message),
                content: (m as unknown as AssistantMessage).content
                  .map((c) => c.text)
                  .join(""),
              };
              return {
                userId: user.id,
                content: message,
                chatId: chat.id,
              };
            }),
          );
        },
      });

      response.consumeStream();

      return response.toDataStreamResponse();
    },
  );
