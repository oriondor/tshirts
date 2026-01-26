import {
  pgTable,
  uuid,
  text,
  timestamp,
  varchar,
  decimal,
  integer,
} from "drizzle-orm/pg-core";
import { orders } from "./orders";

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productType: varchar("product_type", { length: 50 }).notNull(),
  designId: varchar("design_id", { length: 100 }).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  designColor: varchar("design_color", { length: 50 }),
  size: varchar("size", { length: 10 }),
  productColor: varchar("product_color", { length: 50 }),
  name: varchar("name", { length: 255 }),
  secondaryText: varchar("secondary_text", { length: 255 }),
  specialRequest: text("special_request"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
