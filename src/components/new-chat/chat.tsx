"use client";

import type { Attachment, Message } from "ai";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";

import { Messages } from "./messages";
import { toast } from "sonner";
import { MultimodalInput } from "./multimodal-input";

export function Chat({
  id,
  initialMessages,
  isReadonly,
}: {
  id: string;
  initialMessages: Array<Message>;
  isReadonly: boolean;
}) {
  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    reload,
  } = useChat({
    id,
    body: { id },
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    api: "/api/chat",
    experimental_prepareRequestBody({ messages, id }) {
      return { message: messages[messages.length - 1], id };
    },
    generateId: () => crypto.randomUUID(),
    onFinish: () => {},
    onError: () => {
      toast.error("An error occured, please try again!");
    },
  });

  // id: chatId,
  // api: "/api/chat",
  // experimental_prepareRequestBody({ messages, id }) {
  //   return { message: messages[messages.length - 1], id };
  // },
  // sendExtraMessageFields: true,

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  return (
    <>
      <div className="bg-background flex h-dvh min-w-0 flex-col">
        <Messages
          chatId={id}
          isLoading={isLoading}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
        />
        <form className="bg-background mx-auto flex w-full gap-2 px-4 pb-4 md:max-w-3xl md:pb-6">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages}
              append={append}
            />
          )}
        </form>
      </div>
    </>
  );
}
