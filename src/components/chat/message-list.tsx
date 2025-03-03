import React from "react";
import {
  ChatMessage,
  type ChatMessageProps,
  type Message,
} from "@/components/chat/chat-message";
import { TypingIndicator } from "@/components/chat/typing-indicator";

type AdditionalMessageOptions = Omit<ChatMessageProps, keyof Message>;

interface MessageListProps {
  messages: Message[];
  showTimeStamps?: boolean;
  isTyping?: boolean;
  messageOptions?:
    | AdditionalMessageOptions
    | ((message: Message) => AdditionalMessageOptions);
}

const MemoizedMessage = React.memo(
  ({
    message,
    showTimeStamp,
    messageOptions,
  }: {
    message: Message;
    showTimeStamp: boolean;
    messageOptions?:
      | AdditionalMessageOptions
      | ((message: Message) => AdditionalMessageOptions);
  }) => {
    const additionalOptions =
      typeof messageOptions === "function"
        ? messageOptions(message)
        : messageOptions;

    return (
      <ChatMessage
        showTimeStamp={showTimeStamp}
        {...message}
        {...additionalOptions}
      />
    );
  },
  (prevProps, nextProps) => {
    const prevMessage = prevProps.message;
    const nextMessage = nextProps.message;

    const basicPropsEqual =
      prevMessage.id === nextMessage.id &&
      prevMessage.role === nextMessage.role &&
      prevMessage.content === nextMessage.content &&
      prevProps.showTimeStamp === nextProps.showTimeStamp;

    if (!basicPropsEqual) return false;

    const prevTime = prevMessage.createdAt?.getTime();
    const nextTime = nextMessage.createdAt?.getTime();
    if (prevTime !== nextTime) return false;

    const prevAttachments = prevMessage.experimental_attachments;
    const nextAttachments = nextMessage.experimental_attachments;
    if (prevAttachments?.length !== nextAttachments?.length) return false;

    const prevTools = prevMessage.toolInvocations;
    const nextTools = nextMessage.toolInvocations;
    if (prevTools?.length !== nextTools?.length) return false;

    return true;
  },
);

MemoizedMessage.displayName = "MemoizedMessage";

export const MessageList = React.memo(
  function MessageList({
    messages,
    showTimeStamps = true,
    isTyping = false,
    messageOptions,
  }: MessageListProps) {
    return (
      <div className="w-full space-y-4 overflow-visible">
        {messages.map((message, index) => (
          <MemoizedMessage
            key={message.id || index}
            message={message}
            showTimeStamp={showTimeStamps}
            messageOptions={messageOptions}
          />
        ))}
        {isTyping && <TypingIndicator />}
      </div>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.messages.length !== nextProps.messages.length) return false;
    if (prevProps.isTyping !== nextProps.isTyping) return false;
    if (prevProps.showTimeStamps !== nextProps.showTimeStamps) return false;

    for (let i = 0; i < prevProps.messages.length; i++) {
      const prevMessage = prevProps.messages[i];
      const nextMessage = nextProps.messages[i];

      if (
        prevMessage.id !== nextMessage.id ||
        prevMessage.content !== nextMessage.content ||
        prevMessage.role !== nextMessage.role
      ) {
        return false;
      }
    }

    return true;
  },
);
