import { createServerFn } from "@tanstack/react-start";
import { dbUpsertPublicKey } from "~/db/service/publickey";
import { serverMiddlewareAuth } from "./middleware";

interface serverUpsertPublicKeyData {
  publicKey: string;
}
export const serverUpsertPublicKey = createServerFn({
  method: "POST",
})
  .middleware([serverMiddlewareAuth])
  .validator((data: serverUpsertPublicKeyData) => data)
  .handler(async ({ context, data }) => {
    return dbUpsertPublicKey({
      userId: context.user.id,
      publicKey: data.publicKey,
    });
  });
