"use client";

import { Message } from "@ai-sdk/react";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import Chat from "./chat";
import { Loader2 } from "lucide-react";
export default function ChatLanding({
  id,
  newChat,
}: {
  id: string;
  newChat?: boolean;
}) {
  const { data: chat, isPending } = useQuery({
    queryKey: ["chats", id],
    queryFn: async () => {
      const res = await client.api.chat[":id"].$get({
        param: { id },
      });

      const data = await res.json();

      if ("error" in data) {
        throw new Error(data.error);
      }

      console.log(data.chat.messages[0].content);
      const messages = data.chat.messages.map(
        ({ content }: { content: Message }) => ({
          id: content.id,
          content: content.content,
          role: content.role,
          createdAt: new Date(),
        }),
      );

      return { ...data.chat, messages };
    },
    enabled: !newChat,
  });

  return (
    <div className="h-full w-full">
      {!newChat && isPending && (
        <div className="flex h-full w-full items-center justify-center pt-52">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      )}
      {(newChat || chat) && <Chat id={id} initialMessages={chat?.messages} />}
    </div>
  );
}
