import {
  pgTable,
  varchar,
  date,
  decimal,
  boolean,
  uuid,
  integer,
  jsonb,
  pgEnum,
  timestamp
} from "drizzle-orm/pg-core";
import { land } from "./land";
import { users } from "./users";

export const initialDepositEnum = pgEnum("initial_deposit_status", [
  "paid",
  "notpaid",
  "returned",
]);

export const transaction = pgTable("transaction", {
  transactionId: uuid("transactionId")
    .defaultRandom()
    .notNull()
    .primaryKey(),

  landId: uuid("landId")
    .notNull()
    .references(() => land.landId),

  buyerId: uuid("buyerId")
    .notNull()
    .references(() => users.user_id),

  sellerId: uuid("sellerId")
    .notNull()
    .references(() => users.user_id),

  initialDeposit: decimal("initialDeposit", { precision: 8, scale: 2 }).notNull(),

  initialDepositStatus: initialDepositEnum("initialDepositStatus")
    .notNull()
    .default("notpaid"),

  monthlyDue: varchar("monthlyDue", { length: 255 }).notNull(),

  totalMonths: integer("totalMonths").notNull(),

  buyerApproved: boolean("buyerApproved").notNull().default(false),
  sellerApproved: boolean("sellerApproved").notNull().default(false),

  payments: jsonb("payments").$type<{ month: number; paid: boolean }[]>(),

  transactionDate: timestamp("transactionDate").notNull().defaultNow(),

  lastTransactionDate : timestamp("lastTransactionDate").notNull().defaultNow()
});
