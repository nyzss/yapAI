"use client";

import { Input } from "@/components/ui/input";
import Markdown from "react-markdown";
import { useChat } from "@ai-sdk/react";
import { CodeHighlight } from "@/components/chat/code";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

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
