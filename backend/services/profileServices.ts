// profileServices.ts

import { eq } from "drizzle-orm";
import { db } from "../db/connection";
import { users } from "../db/schema/users";
import { land } from "../db/schema/land";

// Existing function
export const getProfileByUserId = async (userId: string) => {
  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.user_id, userId))
    .execute();

  const user = userResult[0];
  if (!user) throw new Error("User not found");

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

// New function to update user profile
export const updateProfileByUserId = async (
  userId: string,
  data: {
    username?: string;
    email?: string;
    mobile?: string;
    age?: number;
    dateofbirth?: string;
  }
) => {
  const updatedResult = await db
    .update(users)
    .set(data)
    .where(eq(users.user_id, userId))
    .returning()
    .execute();

  const updatedUser = updatedResult[0];
  if (!updatedUser) throw new Error("Failed to update profile");

  return updatedUser;
};
