"use client";

import { Message, useChat } from "@ai-sdk/react";
import { useEffect, FormEvent, KeyboardEvent } from "react";
import { useLocalStorageState } from "ahooks";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import MessageHistory from "@/components/chat/message-history";

export default function Home() {
  const [messageHistory, setMessageHistory] = useLocalStorageState<Message[]>(
    "message-history",
    {
      defaultValue: [],
    },
  );
  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat({
      api: "/api/chat",
    });

  useEffect(() => {
    if (messageHistory && messageHistory.length > 0) {
      setMessages(messageHistory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setMessageHistory(messages);
    }
  }, [messages, setMessageHistory]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  const handleSendClick = (e: React.MouseEvent) => {
    handleSubmit(e as unknown as FormEvent);
  };

  return (
    <div className="absolute inset-0 flex flex-col">
      <MessageHistory messages={messages} />

      <div className="pointer-events-none absolute inset-0 flex items-end">
        <div className="from-background pointer-events-auto w-full bg-gradient-to-t to-transparent p-4 pt-16">
          <div className="relative w-full max-w-full px-6">
            <Textarea
              value={input}
              placeholder="Type your message..."
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="bg-background/80 border-muted max-h-[120px] min-h-[60px] resize-none pr-12"
            />
            <Button
              type="button"
              size="icon"
              onClick={handleSendClick}
              className="absolute right-8 bottom-2 h-8 w-8"
              disabled={!input.trim()}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
