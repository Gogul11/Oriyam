import { pgTable, varchar, integer, date, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  user_id: uuid("user_id").defaultRandom().primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  mobile: varchar("mobile", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  age: integer("age").notNull(),
  goverment_id: varchar("goverment_id", { length: 50 }).notNull().unique(),
  dateofbirth: date("dateofbirth").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  
  // photo: varchar("photo", { length: 255 }).notNull(),
});

