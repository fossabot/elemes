import { json } from "@tanstack/react-start";
import { randomUUID } from "uncrypto";
import { dbVerifyPublicUser } from "~/db/service/publickey";

export const ServerRoute = createServerFileRoute().methods({
  GET: async ({ request, params }) => {
    const { publicKey, userId } = params;
    const headers = request.headers;
    const oracleHeader = headers.get("X-Is-oracle");

    const expectedOracleHeader = process.env.ORACLE_HEADER || randomUUID();

    if (oracleHeader !== expectedOracleHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const correct = await dbVerifyPublicUser(userId, publicKey);

    return json({
      authorized: correct,
    });
  },
});
