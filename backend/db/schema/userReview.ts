import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const userReview = pgTable("user review", {
  user_review_id: uuid("user_review_id").notNull().primaryKey(),
  user_id: uuid("user_id").notNull().references(() => users.user_id),
  review: uuid("review").notNull(),
});
