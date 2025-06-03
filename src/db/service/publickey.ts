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
