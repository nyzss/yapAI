"use client";

import { Message, useChat } from "@ai-sdk/react";
import { useEffect, useState, useCallback, memo } from "react";
import MessageHistory from "@/components/chat/message-history";
import ChatInput from "./chat-input";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

// Memoize MessageHistory to prevent re-renders when parent state changes
const MemoizedMessageHistory = memo(MessageHistory);

export default function Chat({ id }: { id: string | null }) {
  const router = useRouter();
  const [isStreaming, setIsStreaming] = useState(false);

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

  const [chatId, setChatId] = useState<string>(id ?? "");

  const { messages, setInput, setMessages, status, handleSubmit } = useChat({
    id: chatId,
    api: "/api/chat",
    experimental_prepareRequestBody({ messages, id }) {
      return { message: messages[messages.length - 1], id };
    },
    sendExtraMessageFields: true,
    onResponse: () => {
      setIsStreaming(true);
    },
    onFinish: () => {
      setIsStreaming(false);
    },
  });

  const handleMessageSubmit = useCallback(
    (message: string) => {
      if (!id) {
        const newChatId = crypto.randomUUID();
        setChatId(newChatId);
        router.push(`/c/${newChatId}`);
      }

      setInput(message);

      setTimeout(() => {
        handleSubmit();
      }, 0);
    },
    [id, handleSubmit, router, setInput],
  );

  useEffect(() => {
    if (chatData?.error === null) {
      const messages = chatData.chat.messages.map((m) => m.content as Message);
      setMessages(messages);
    }
  }, [chatData, setMessages]);

  return (
    <div className="absolute inset-0 flex flex-col">
      <MemoizedMessageHistory messages={messages} />

      <ChatInput
        onSubmit={handleMessageSubmit}
        isDisabled={status === "streaming" || isStreaming}
      />
    </div>
  );
}
