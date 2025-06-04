import { db } from "../config";
import { UserId } from "../schemas/public/User";

export async function dbGetNameById(id: UserId) {
  return db
    .selectFrom("user")
    .select(["name"])
    .where("id", "=", id)
    .executeTakeFirstOrThrow();
}

export async function dbGetNameByIdString(id: string) {
  const idB = id as UserId & { __brand: "public.user" };

  return db
    .selectFrom("user")
    .select(["name"])
    .where("id", "=", idB)
    .executeTakeFirstOrThrow();
}
