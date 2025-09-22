import { db } from "../db/connection";
import { sql } from "drizzle-orm";

// 🔹 Interests for a land (existing)
export const getLandInterestsByLandId = async (landId: string) => {
  const result = await db.execute(sql`
    SELECT li."interestId", li."landId", li."budgetPerMonth", li."rentPeriod", li."reason", li."created_at",
           u."user_id", u."username", u."email", u."mobile", u."age"
    FROM "landInterest" li
    JOIN "users" u ON li."userId" = u."user_id"
    WHERE li."landId" = ${landId}
    ORDER BY li."created_at" DESC
  `);
  return result.rows;
};

// 🔹 Interests made by a user
export const getLandInterestsByUserId = async (userId: string) => {
  const result = await db.execute(sql`
    SELECT li."interestId", li."landId", li."budgetPerMonth", li."rentPeriod", li."reason", li."created_at",
           l."title" as "landTitle", l."status" as "landStatus"
    FROM "landInterest" li
    JOIN "land" l ON li."landId" = l."landId"
    WHERE li."userId" = ${userId}
    ORDER BY li."created_at" DESC
  `);
  return result.rows;
};