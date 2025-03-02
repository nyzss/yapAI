"use client";

import { Message, useChat } from "@ai-sdk/react";
import { useEffect, useState } from "react";
import MessageHistory from "@/components/chat/message-history";
import ChatInput from "./chat-input";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

export default function Chat({ id }: { id: string | null }) {
  const router = useRouter();
  const { data: chatData } = useQuery({
    queryKey: ["chat", id],
    queryFn: async () => {
      const resp = await client.api.chat[":id"].$get({
        param: {
          id: id!,
        },
      });

      const data = await resp.json();
      return data;
    },
    enabled: id !== null,
  });
  //   const [input, setInput] = useState("");
  const [chatId, setChatId] = useState<string>(id ?? "");

  const { messages, handleSubmit, input, setInput, setMessages } = useChat({
    id: chatId,
    api: "/api/chat",
    experimental_prepareRequestBody({ messages, id }) {
      return { message: messages[messages.length - 1], id };
    },
    sendExtraMessageFields: true,
  });

  const handleChatSubmit = () => {
    if (!id) {
      const newChatId = crypto.randomUUID();
      setChatId(newChatId);
      router.push(`/c/${newChatId}`);
    }
    handleSubmit();
  };

  useEffect(() => {
    if (chatData?.error === null) {
      const messages = chatData.chat.messages.map((m) => m.content as Message);
      setMessages(messages);
    }
  }, [chatData, setMessages]);

  return (
    <div className="absolute inset-0 flex flex-col">
      <MessageHistory messages={messages} />

      <ChatInput
        input={input}
        setInput={setInput}
        handleChatSubmit={handleChatSubmit}
      />
    </div>
  );
}
