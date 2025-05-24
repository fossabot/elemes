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
