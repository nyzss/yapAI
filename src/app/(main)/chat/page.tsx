import Chat from "@/components/new-chat/chat";

export default async function ChatPage() {
  const chatId = crypto.randomUUID();

  return (
    <div>
      <Chat id={chatId} />
    </div>
  );
}
