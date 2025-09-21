import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { land } from "./land";

export const landReview = pgTable("land review", {
  land_review_id: uuid("land_review_id").notNull().primaryKey(),
  user_id: uuid("user_id").notNull().references(() => users.user_id),
  land_id: uuid("land_id").notNull().references(() => land.landId),
  review: varchar("review", { length: 255 }).notNull(),
});
