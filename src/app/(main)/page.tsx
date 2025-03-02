"use client";

import Markdown from "react-markdown";
import { Message, useChat } from "@ai-sdk/react";
import { CodeHighlight } from "@/components/chat/code";
import { useEffect, useRef, FormEvent, KeyboardEvent } from "react";
import { useLocalStorageState } from "ahooks";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageHistory && messageHistory.length > 0) {
      setMessages(messageHistory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setMessageHistory(messages);
      // scroll to bottom when new messages arrive
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
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
      <div
        className="w-full flex-1 overflow-y-auto"
        style={{ scrollbarWidth: "thin" }}
      >
        <div
          role="log"
          aria-label="Chat messages"
          aria-live="polite"
          className="flex w-full flex-col space-y-6 p-4 px-6 pb-36"
        >
          {messages.length === 0 && (
            <div className="text-muted-foreground py-12 text-center">
              <p>Start a conversation with the AI assistant</p>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`${
                  m.role === "user"
                    ? "bg-muted text-primary max-w-[80%] rounded-lg p-4 break-words"
                    : "max-w-[80%] rounded-lg p-4 break-words"
                }`}
              >
                <Markdown
                  components={{
                    code: CodeHighlight,
                    pre: (props) => (
                      <pre
                        {...props}
                        className="max-w-full overflow-x-auto"
                        style={{ maxWidth: "100%" }}
                      />
                    ),
                  }}
                >
                  {m.content}
                </Markdown>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

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
