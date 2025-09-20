import { pgTable, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { land } from "./land";

export const landReview = pgTable("land review", {
  land_review_id: varchar("land_review_id", { length: 255 }).notNull().primaryKey(),
  user_id: varchar("user_id", { length: 255 }).notNull().references(() => users.user_id),
  land_id: varchar("land_id", { length: 255 }).notNull().references(() => land.land_id),
  review: varchar("review", { length: 255 }).notNull(),
});
