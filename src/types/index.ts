export type HistoryItem = {
  id: string;
  title: string;
  type: "chat" | "folder";
  items: HistoryItem[];
  createdAt: string | Date;
  updatedAt: string | Date;
};
