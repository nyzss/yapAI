import Chat from "@/components/chat/chat";
import React from "react";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return (
    <div>
      <Chat id={id} />
    </div>
  );
}
