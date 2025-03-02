import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { user } from "./auth-schema";
export * from "./auth-schema";

export const foldersTable = pgTable("folders", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chatsTable = pgTable("chats", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 255 }).notNull(),
  folderId: uuid("folder_id").references(() => foldersTable.id, {
    onDelete: "cascade",
  }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messagesTable = pgTable("messages", {
  id: uuid().primaryKey().defaultRandom(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chatsTable.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  content: jsonb().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const foldersRelations = relations(foldersTable, ({ one, many }) => ({
  user: one(user, {
    fields: [foldersTable.userId],
    references: [user.id],
  }),
  chats: many(chatsTable),
}));

export const chatsRelations = relations(chatsTable, ({ one, many }) => ({
  folder: one(foldersTable, {
    fields: [chatsTable.folderId],
    references: [foldersTable.id],
  }),
  user: one(user, {
    fields: [chatsTable.userId],
    references: [user.id],
  }),
  messages: many(messagesTable),
}));

export const messagesRelations = relations(messagesTable, ({ one }) => ({
  chat: one(chatsTable, {
    fields: [messagesTable.chatId],
    references: [chatsTable.id],
  }),
  user: one(user, {
    fields: [messagesTable.userId],
    references: [user.id],
  }),
}));
