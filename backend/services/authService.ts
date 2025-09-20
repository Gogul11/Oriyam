import { db } from "../db/connection"
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { users } from "../db/schema/users";


type RegisterInput = {
  username: string;
  email: string;
  mobile: string;
  password: string;
  age: number;
  goverment_id: string;
  dateofbirth: string | Date;
};

export const registerUser = async (data: RegisterInput) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const [newUser] = await db
    .insert(users)
    .values({
      username: data.username,
      email: data.email,
      mobile: data.mobile,
      password: hashedPassword,
      age: data.age,
      goverment_id: data.goverment_id,
      dateofbirth: new Date(data.dateofbirth).toISOString(),
    })
    .returning();
    if(!newUser) {
      throw new Error("User registration failed");
    }
  return newUser;
};

export const findUserByEmail = async (email: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
};