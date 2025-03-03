import { Chat } from "@/components/new-chat/chat";

export default function ChatPage() {
  const id = crypto.randomUUID();

  return (
    <>
      <Chat key={id} id={id} initialMessages={[]} isReadonly={false} />
    </>
  );
}
