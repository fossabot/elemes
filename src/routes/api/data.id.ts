import { json } from "@tanstack/react-start";
import { auth } from "~/lib/auth";

export const ServerRoute = createServerFileRoute().methods({
  GET: async ({ request }) => {
    const headers = request.headers;
    const session = await auth.api.getSession({
      headers,
      query: { disableCookieCache: true },
    });
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    return json({
      id: session.user.id,
    });
  },
});
