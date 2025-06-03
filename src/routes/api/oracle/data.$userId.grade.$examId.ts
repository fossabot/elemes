import { json } from "@tanstack/react-start";
import { dbGetExamAttemptById } from "~/db/service/examAttempt";

export const ServerRoute = createServerFileRoute().methods({
  GET: async ({ request, params }) => {
    const { examId, userId } = params;
    const examIdNum = Number(examId);
    if (isNaN(examIdNum)) {
      return new Response(JSON.stringify({ error: "Invalid exam ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const headers = request.headers;
    const oracleHeader = headers.get("X-Is-oracle");

    if (oracleHeader !== "1") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const examResult = await dbGetExamAttemptById(examIdNum, userId);

    return json(examResult);
  },
});
