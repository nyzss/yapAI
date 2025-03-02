"use client";

import { useChat } from "@ai-sdk/react";

import { Chat } from "@/components/ui/chat";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, status, stop } =
    useChat({
      api: "/api/chat",
      generateId: () => crypto.randomUUID(),
      experimental_prepareRequestBody({ messages, id }) {
        return { message: messages[messages.length - 1], id };
      },
      sendExtraMessageFields: true,
      experimental_throttle: 100,
    });

  return (
    <Chat
      messages={messages}
      input={input}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      isGenerating={status === "streaming"}
      stop={stop}
    />
  );
}
