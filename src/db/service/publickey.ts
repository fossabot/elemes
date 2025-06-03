import { CleanPublickey } from "~/types/db";
import { db } from "../config";
import { UserId } from "../schemas/public/User";

interface PublicKeyData {
  userId: string;
  publicKey: string;
}

export async function dbUpsertPublicKey(data: PublicKeyData) {
  const userIdB = data.userId as UserId & { __brand: "public.user" };

  const result = await db
    .insertInto("publickey")
    .values({
      userId: userIdB,
      publicKey: data.publicKey,
    })
    .onConflict((oc) =>
      oc.column("userId").doUpdateSet({
        publicKey: data.publicKey,
      }),
    )
    .returningAll()
    .executeTakeFirstOrThrow();

  return result as CleanPublickey;
}

export async function dbVerifyPublicUser(
  userId: string,
  publicKey: string,
): Promise<boolean> {
  const userIdB = userId as UserId & { __brand: "public.user" };

  const result = await db
    .selectFrom("publickey")
    .select("publicKey")
    .where("userId", "=", userIdB)
    .executeTakeFirst();

  if (!result) {
    return false;
  }

  return result.publicKey === publicKey;
}
