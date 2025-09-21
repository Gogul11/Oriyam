import { randomUUID } from "crypto";
import { pgTable, uuid, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { land } from "./land";
import { users } from "./users";

export const interestForm = pgTable("landInterest", {
  interestId: uuid("interestId").defaultRandom().primaryKey(),
  landId : uuid("landId").notNull().references(() => land.landId),
  userId: uuid("userId").notNull().references(() => users.user_id),
  budgetPerMonth: integer("budgetPerMonth").notNull(), 
  rentPeriod: varchar("rentPeriod", { length: 50 }).notNull(), 
  reason: text("reason").notNull(), 
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
