import { pgTable, varchar, bigint, date, decimal, boolean } from "drizzle-orm/pg-core";
import { users } from "./users";

export const land = pgTable("land", {
    land_id: varchar("land_id", { length: 255 }).notNull().primaryKey(),
    user_id: varchar("user_id", { length: 255 }).notNull().references(() => users.user_id, {onDelete : "cascade"}),
    coordinates: varchar("coordinates", { length: 255 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    area: varchar("area", { length: 20 }).notNull(),    
    unit: varchar("unit", { length: 255 }).notNull(),
    location: varchar("location", { length: 255 }).notNull(),
    latitude: decimal("latitude", { precision: 8, scale: 2 }).notNull(),
    longitude: decimal("longitude", { precision: 8, scale: 2 }).notNull(),
    soil_type: varchar("soil_type", { length: 255 }).notNull(),
    water_source: varchar("water_source", { length: 255 }).notNull(),
    availability_from: date("availability_from").notNull(),
    availability_to: date("availability_to").notNull(),
    rent_price_per_month: decimal("rent_price_per_month", { precision: 8, scale: 2 }).notNull(),
    status: boolean("status").notNull(),
    created_at: date("created_at").notNull(),
    updated_at: date("updated_at").notNull(),
    // land_photos: varchar("land_photos", { length: 1000 }).notNull(), // URLs stored as string
});
