import { pgTable, varchar, date, decimal, boolean } from "drizzle-orm/pg-core";
import { land } from "./land";
import { users } from "./users";

export const transaction = pgTable("transaction", {
  transaction_id: varchar("transaction_id", { length: 255 }).notNull().primaryKey(), 
  land_id: varchar("land_id", { length: 255 }).notNull().references(() => land.land_id),
  buyer_id: varchar("buyer_id", { length: 255 }).notNull().references(() => users.user_id),
  seller_id: varchar("seller_id", { length: 255 }).notNull().references(() => users.user_id),
  initial_deposit: decimal("initial_deposit", { precision: 8, scale: 2 }).notNull(),
  is_monthly_due_paid: boolean("is_monthly_due_paid").notNull(),
  monthly_due: varchar("monthly_due", { length: 255 }).notNull(),
  transaction_date: date("transaction_date").notNull(),
  start_date: varchar("start_date", { length: 255 }).notNull(), 
  end_date: varchar("end_date", { length: 255 }).notNull(),     
});
