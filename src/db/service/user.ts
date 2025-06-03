import { db } from "../config";
import { UserId } from "../schemas/public/User";

export async function dbGetNameById(id: UserId) {
  const user = await db
    .selectFrom("user")
    .select(["name"])
    .where("id", "=", id)
    .executeTakeFirstOrThrow();

  return user;
}

export async function dbGetNameByIdString(id: string) {
  const idB = id as UserId & { __brand: "public.user" };

  const user = await db
    .selectFrom("user")
    .select(["name"])
    .where("id", "=", idB)
    .executeTakeFirstOrThrow();

  return user;
}
