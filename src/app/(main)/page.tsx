import ChatLanding from "@/components/chat/chat-landing";

export default async function Home() {
  const chatId = crypto.randomUUID();

  return (
    <div>
      <ChatLanding id={chatId} newChat={true} />
    </div>
  );
}
