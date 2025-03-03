import ChatLanding from "@/components/chat/chat-landing";
import React from "react";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return (
    <div>
      <ChatLanding id={id} newChat={false} />
    </div>
  );
}
