import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { env } from "@/lib/env";

export const db = drizzle({
  connection: {
    connectionString: env.DATABASE_URL,
    ssl: true,
    database: "yapai",
  },
  schema,
});
