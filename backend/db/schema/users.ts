import { pgTable, varchar, integer, date } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  user_id: varchar("user_id", { length: 255 }).notNull().primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).unique(),
  mobile: varchar("mobile", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  age: integer("age").notNull(),
  goverment_id: varchar("goverment_id", { length: 50 }).notNull().unique(),
  dateofbirth: date("dateofbirth").notNull(),
  created_at: date("created_at").notNull(),
  updated_at: date("updated_at").notNull(),
  // photo: varchar("photo", { length: 255 }).notNull(),
});
