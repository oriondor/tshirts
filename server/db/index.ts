import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Re-export all schemas
export * from "./schema";

// Database connection (lazy initialization)
let db: ReturnType<typeof drizzle> | null = null;
let client: ReturnType<typeof postgres> | null = null;

export function getDb() {
  if (!db) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not defined");
    }
    client = postgres(connectionString);
    db = drizzle(client);
  }
  return db;
}
