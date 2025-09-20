import { pgTable, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const userReview = pgTable("user review", {
  user_review_id: varchar("user_review_id", { length: 255 }).notNull().primaryKey(),
  user_id: varchar("user_id", { length: 255 }).notNull().references(() => users.user_id),
  review: varchar("review", { length: 255 }).notNull(),
});
