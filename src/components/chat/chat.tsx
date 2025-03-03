"use client";

import { Message, useChat } from "@ai-sdk/react";
import { ChatComponent } from "@/components/chat/chat-component";

export default function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages?: Message[];
}) {
  const { messages, input, handleInputChange, handleSubmit, status, stop } =
    useChat({
      id,
      api: "/api/chat",
      experimental_prepareRequestBody({ messages, id }) {
        return { message: messages[messages.length - 1], id };
      },
      sendExtraMessageFields: true,
      onError(error) {
        console.log(error);
      },
      initialMessages,
    });

  return (
    <ChatComponent
      messages={messages}
      input={input}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      isGenerating={status === "streaming"}
      stop={stop}
    />
  );
}
