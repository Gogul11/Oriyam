import { pgTable, varchar, bigint, date, decimal, boolean, uuid} from "drizzle-orm/pg-core";
import { users } from "./users";

export const land = pgTable("land", {
    landId: uuid("landId").defaultRandom().notNull().primaryKey(),
    userId: uuid("userId").notNull().references(() => users.user_id, {onDelete : "cascade"}),

    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),

    area: varchar("area", { length: 20 }).notNull(),    
    unit: varchar("unit", { length: 255 }).notNull(),
    rentPricePerMonth: decimal("rentPricePerMonth", { precision: 8, scale: 2 }).notNull(),

    soilType: varchar("soilType", { length: 255 }).notNull(),
    waterSource: varchar("waterSource", { length: 255 }).notNull(),

    availabilityFrom: date("availabilityFrom").notNull(),
    availabilityTo: date("availabilityTo").notNull(),

    coordinates: varchar("coordinates", { length: 255 }).unique().array(),
    photos : varchar("photos", {length : 255}).array(),

    status: boolean("status").notNull().default(true),
    
    created_at: date("created_at").notNull(),
    updated_at: date("updated_at").notNull(),
    // land_photos: varchar("land_photos", { length: 1000 }).notNull(), // URLs stored as string
});
