import { dbGetExamById } from "~/db/service/exam";
import { dbGetExamAttemptById } from "~/db/service/examAttempt";
import { auth } from "~/lib/auth";
import { generateCertificate } from "~/lib/generateCertificate";

export const ServerRoute = createServerFileRoute().methods({
  GET: async ({ request, params }) => {
    try {
      const headers = request.headers;
      const { examId } = params;
      const session = await auth.api.getSession({
        headers,
        query: { disableCookieCache: true },
      });

      const examIdNum = Number(examId);
      if (isNaN(examIdNum)) {
        return new Response(JSON.stringify({ error: "Invalid exam ID" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const examResult = await dbGetExamAttemptById(examIdNum, session.user.id);
      if (!examResult) {
        return new Response(
          JSON.stringify({ error: "Exam attempt not found" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      const examData = await dbGetExamById(examIdNum);
      if (!examData) {
        return new Response(JSON.stringify({ error: "Exam not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      const pdfBuffer = generateCertificate({
        userName: session.user.name,
        examName: examData.title,
        date: examResult.submittedAt.toISOString().split("T")[0],
      });

      const fileName = `${session.user.name}-${examData.title}-certificate.pdf`;

      return new Response(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Content-Length": pdfBuffer.byteLength.toString(),
        },
      });
    } catch (error) {
      console.error("Certificate generation error:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});
