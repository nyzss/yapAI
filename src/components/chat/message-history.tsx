import { cn } from "@/lib/utils";
import { Message } from "@ai-sdk/react";
import Markdown from "react-markdown";
import { CodeHighlight } from "./code";
import { useEffect, useRef } from "react";
import { useDebounceFn } from "ahooks";

export default function MessageHistory({ messages }: { messages: Message[] }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { run } = useDebounceFn(
    () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    },
    {
      wait: 100,
    },
  );

  useEffect(() => {
    run();
  }, [messages, run]);

  return (
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
              className={cn(
                "prose prose-neutral dark:prose-invert",
                m.role === "user"
                  ? "bg-muted text-primary max-w-[80%] rounded-lg p-4 break-words"
                  : "max-w-[80%] rounded-lg p-4 break-words",
              )}
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
  );
}
