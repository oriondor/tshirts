import {
  pgTable,
  uuid,
  text,
  timestamp,
  varchar,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const orderStatusEnum = pgEnum("order_status", [
  "unpaid",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  status: orderStatusEnum("status").notNull().default("unpaid"),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("EUR"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderStatus =
  | "unpaid"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
