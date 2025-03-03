"use client";

import { useChat } from "@ai-sdk/react";
import { ChatComponent as ChatComponent } from "@/components/new-chat/chat-component";

export default function Chat({ id }: { id: string }) {
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
