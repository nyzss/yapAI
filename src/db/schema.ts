import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export * from "./auth-schema";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
