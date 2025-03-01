"use client";

import { Input } from "@/components/ui/input";
import Markdown from "react-markdown";
import { Message, useChat } from "@ai-sdk/react";
import { CodeHighlight } from "@/components/chat/code";
import { useEffect } from "react";
import { useLocalStorageState } from "ahooks";

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

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === "user" ? "User: " : "AI: "}

          <Markdown
            components={{
              code: CodeHighlight,
            }}
          >
            {m.content}
          </Markdown>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <Input
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
