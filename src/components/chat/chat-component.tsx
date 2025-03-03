"use client";

import React, { forwardRef, useState, type ReactElement, useMemo } from "react";
import { ArrowDown, ThumbsDown, ThumbsUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { useAutoScroll } from "@/hooks/use-auto-scroll";
import { Button } from "@/components/ui/button";
import { type Message } from "@/components/chat/chat-message";
import { CopyButton } from "@/components/chat/copy-button";
import { MessageInput } from "@/components/chat/message-input";
import { MessageList } from "@/components/chat/message-list";
import { PromptSuggestions } from "@/components/chat/prompt-suggestions";

interface ChatPropsBase {
  handleSubmit: (
    event?: { preventDefault?: () => void },
    options?: { experimental_attachments?: FileList },
  ) => void;
  messages: Array<Message>;
  input: string;
  className?: string;
  handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  isGenerating: boolean;
  stop?: () => void;
  onRateResponse?: (
    messageId: string,
    rating: "thumbs-up" | "thumbs-down",
  ) => void;
}

interface ChatPropsWithoutSuggestions extends ChatPropsBase {
  append?: never;
  suggestions?: never;
}

interface ChatPropsWithSuggestions extends ChatPropsBase {
  append: (message: { role: "user"; content: string }) => void;
  suggestions: string[];
}

type ChatProps = ChatPropsWithoutSuggestions | ChatPropsWithSuggestions;

export function ChatComponent({
  messages,
  handleSubmit,
  input,
  handleInputChange,
  stop,
  isGenerating,
  append,
  suggestions,
  className,
  onRateResponse,
}: ChatProps) {
  const lastMessage = messages.at(-1);
  const isEmpty = messages.length === 0;
  const isTyping = lastMessage?.role === "user";

  const messageOptions = useMemo(() => {
    return (message: Message) => ({
      actions: onRateResponse ? (
        <>
          <div className="border-r pr-1">
            <CopyButton
              content={message.content}
              copyMessage="Copied response to clipboard!"
            />
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => onRateResponse(message.id, "thumbs-up")}
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => onRateResponse(message.id, "thumbs-down")}
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <CopyButton
          content={message.content}
          copyMessage="Copied response to clipboard!"
        />
      ),
    });
  }, [onRateResponse]);

  return (
    <ChatContainer className={className}>
      <div className="relative flex h-full flex-col">
        {isEmpty && append && suggestions ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 right-0 left-0 z-10"
          >
            <PromptSuggestions
              label="Try these prompts ✨"
              append={append}
              suggestions={suggestions}
            />
          </motion.div>
        ) : null}

        <AnimatePresence mode="wait">
          {messages.length > 0 ? (
            <motion.div
              key="messages"
              className="flex-1 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChatMessages messages={messages}>
                <MessageList
                  messages={messages}
                  isTyping={isTyping}
                  messageOptions={messageOptions}
                />
              </ChatMessages>
            </motion.div>
          ) : (
            <motion.div
              key="empty-space"
              className="flex-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>

        <motion.div
          className="w-full rounded-full"
          initial={{
            position: isEmpty ? "absolute" : "relative",
            maxWidth: isEmpty ? "42rem" : "100%",
            margin: isEmpty ? "0 auto" : "0",
            left: isEmpty ? "50%" : "auto",
            top: isEmpty ? "50%" : "auto",
            x: isEmpty ? "-50%" : 0,
            y: isEmpty ? "-50%" : 0,
            boxShadow: isEmpty
              ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              : "none",
            borderTop: isEmpty ? "none" : "1px solid hsl(var(--border))",
            borderColor: isEmpty ? "transparent" : "hsl(var(--border))",
          }}
          style={{
            position: isEmpty ? "absolute" : "relative",
          }}
          animate={{
            position: isEmpty ? "absolute" : "relative",
            maxWidth: isEmpty ? "42rem" : "100%",
            left: isEmpty ? "50%" : "auto",
            top: isEmpty ? "50%" : "auto",
            x: isEmpty ? "-50%" : 0,
            y: isEmpty ? "-50%" : 0,
            boxShadow: isEmpty
              ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              : "none",
            borderTop: isEmpty ? "none" : "1px solid hsl(var(--border))",
            borderColor: isEmpty ? "transparent" : "hsl(var(--border))",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
        >
          <ChatForm
            className={cn(
              "w-full shrink-0 rounded-full",
              isEmpty ? "border-0" : "px-4 py-4",
            )}
            isPending={isGenerating || isTyping}
            handleSubmit={handleSubmit}
          >
            {({ files, setFiles }) => (
              <MessageInput
                value={input}
                onChange={handleInputChange}
                allowAttachments
                files={files}
                setFiles={setFiles}
                stop={stop}
                isGenerating={isGenerating}
                className="text-md shadow-xl"
              />
            )}
          </ChatForm>
        </motion.div>
      </div>
    </ChatContainer>
  );
}
ChatComponent.displayName = "Chat";

export const ChatMessages = React.memo(function ChatMessages({
  messages,
  children,
}: React.PropsWithChildren<{
  messages: Message[];
}>) {
  const {
    containerRef,
    scrollToBottom,
    handleScroll,
    shouldAutoScroll,
    handleTouchStart,
  } = useAutoScroll([messages]);

  return (
    <div
      className="relative h-full w-full overflow-x-hidden overflow-y-auto"
      ref={containerRef}
      onScroll={handleScroll}
      onTouchStart={handleTouchStart}
    >
      <div className="max-w-full p-4">{children}</div>

      <div className="flex items-end justify-end">
        {!shouldAutoScroll && (
          <div className="sticky right-4 bottom-4 flex w-full justify-end">
            <Button
              onClick={scrollToBottom}
              className="animate-in fade-in-0 slide-in-from-bottom-1 h-8 w-8 rounded-full ease-in-out"
              size="icon"
              variant="ghost"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});
ChatMessages.displayName = "ChatMessages";

export const ChatContainer = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex h-[calc(100vh-4rem)] w-full flex-col", className)}
      {...props}
    />
  );
});
ChatContainer.displayName = "ChatContainer";

interface ChatFormProps {
  className?: string;
  isPending: boolean;
  handleSubmit: (
    event?: { preventDefault?: () => void },
    options?: { experimental_attachments?: FileList },
  ) => void;
  children: (props: {
    files: File[] | null;
    setFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
  }) => ReactElement;
}

export const ChatForm = forwardRef<HTMLFormElement, ChatFormProps>(
  ({ children, handleSubmit, className }, ref) => {
    const [files, setFiles] = useState<File[] | null>(null);

    const onSubmit = (event: React.FormEvent) => {
      if (!files) {
        handleSubmit(event);
        return;
      }

      const fileList = createFileList(files);
      handleSubmit(event, { experimental_attachments: fileList });
      setFiles(null);
    };

    return (
      <form ref={ref} onSubmit={onSubmit} className={className}>
        {children({ files, setFiles })}
      </form>
    );
  },
);
ChatForm.displayName = "ChatForm";

function createFileList(files: File[] | FileList): FileList {
  const dataTransfer = new DataTransfer();
  for (const file of Array.from(files)) {
    dataTransfer.items.add(file);
  }
  return dataTransfer.files;
}
