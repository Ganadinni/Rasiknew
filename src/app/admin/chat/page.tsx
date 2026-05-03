import { ChatWindow } from "@/components/chat/ChatWindow";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Rasik AI | Chat" };

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-8rem)]">
      <ChatWindow />
    </div>
  );
}
