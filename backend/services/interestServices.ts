import { db } from "../db/connection";
import { sql } from "drizzle-orm";

export const getLandInterestsByLandId = async (landId: string) => {
  try {
    // ✅ Fetch landInterest with user details (join users table)
    const result = await db.execute(sql`
      SELECT 
        li."interestId",
        li."landId",
        li."budgetPerMonth",
        li."rentPeriod",
        li."reason",
        li."created_at",
        u."user_id",
        u."username",
        u."email",
        u."mobile",
        u."age"
      FROM "landInterest" li
      JOIN "users" u ON li."userId" = u."user_id"
      WHERE li."landId" = ${landId}
      ORDER BY li."created_at" DESC
    `);

    return result.rows;
  } catch (err) {
    console.error("Error fetching land interests:", err);
    throw new Error("Database query failed");
  }
};