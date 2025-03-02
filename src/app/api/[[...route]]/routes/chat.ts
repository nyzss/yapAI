import { Hono } from "hono";
import { appendClientMessage, Message, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { HonoType } from "../route";
import { db } from "@/db";
import { chatsTable, messagesTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const handleChat = async ({
  id,
  userId,
}: {
  id: string | null;
  userId: string;
}) => {
  if (id) {
    const chat = await db.query.chatsTable.findFirst({
      where: and(eq(chatsTable.id, id), eq(chatsTable.userId, userId)),
      with: {
        messages: true,
      },
    });

    if (!chat) {
      throw new Error("Chat not found");
    }

    return chat;
  }

  const [newChat] = await db
    .insert(chatsTable)
    .values({
      userId,
      folderId: null,
      title: "New Chat",
    })
    .returning({
      id: chatsTable.id,
    });

  const chat = await db.query.chatsTable.findFirst({
    where: and(eq(chatsTable.id, newChat.id), eq(chatsTable.userId, userId)),
    with: {
      messages: true,
    },
  });

  if (!chat) {
    throw new Error("Chat not found");
  }

  return chat;
};

export const chatRoute = new Hono<HonoType>().post(
  "/",

  async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const { message, id }: { message: Message; id: string } =
      await c.req.json();

    const chat = await handleChat({ id: null, userId: user.id });

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
        console.log(response.messages);
        await db.insert(messagesTable).values(
          response.messages.map((m) => ({
            userId: user.id,
            content: m,
            chatId: chat.id,
          })),
        );
      },
    });

    response.consumeStream();

    return response.toDataStreamResponse();
  },
);
