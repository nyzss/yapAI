import Chat from "@/components/chat/chat";

export default async function Home() {
  const chatId = crypto.randomUUID();

  return (
    <div>
      <Chat id={chatId} />
    </div>
  );
}
