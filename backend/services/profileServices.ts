import { eq } from "drizzle-orm";
import { db } from "../db/connection";
import { users } from "../db/schema/users";
import { land } from "../db/schema/land";

export const getProfileByUserId = async (userId: string) => {
  // Fetch user info
  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.user_id, userId))
    .execute();

  const user = userResult[0];
  if (!user) throw new Error("User not found");

  // Fetch user's lands
  const lands = await db
    .select()
    .from(land)
    .where(eq(land.userId, userId))
    .execute();

  return {
    ...user,
    lands: lands || [],
  };
};
