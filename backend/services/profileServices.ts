import { eq } from "drizzle-orm";
import { db } from "../db/connection"; // your Drizzle instance
import { users } from "../db/schema/users";
import { land } from "../db/schema/land";

export const getProfileByUserId = async (userId: string) => {
  // Fetch user
  const user = await db
    .select()
    .from(users)
    .where(eq(users.user_id, userId));

  if (!user) throw new Error("User not found");

  // Fetch lands
  const lands = await db
    .select()
    .from(land)
    .where(eq(land.userId, userId));

  return {
    ...user,
    lands: lands || [],
  };
};
