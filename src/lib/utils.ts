import { chatsTable } from "@/db/schema";
import { HistoryItem } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { InferSelectModel } from "drizzle-orm";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Chat = InferSelectModel<typeof chatsTable>;

export function transformChats(chats: Chat[]): HistoryItem[] {
  return chats.map((chat) => ({
    id: chat.id,
    title: chat.title,
    type: "chat",
    items: [],
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
  }));
}
