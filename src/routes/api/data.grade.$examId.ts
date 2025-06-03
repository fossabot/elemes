import { json } from "@tanstack/react-start";
import { dbGetExamAttemptById } from "~/db/service/examAttempt";
import { auth } from "~/lib/auth";

export const ServerRoute = createServerFileRoute().methods({
  GET: async ({ request, params }) => {
    const { examId } = params;
    const examIdNum = Number(examId);
    if (isNaN(examIdNum)) {
      return new Response(JSON.stringify({ error: "Invalid exam ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

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

    const examResult = await dbGetExamAttemptById(examIdNum, session.user.id);

    return json(examResult);
  },
});
