import { randomUUID } from "uncrypto";
import { dbGetExamById } from "~/db/service/exam";
import { dbGetExamAttemptById } from "~/db/service/examAttempt";
import { dbGetNameByIdString } from "~/db/service/user";
import { generateCertificate } from "~/lib/generateCertificate";

export const ServerRoute = createServerFileRoute().methods({
  GET: async ({ request, params }) => {
    try {
      const headers = request.headers;
      const { examId, userId } = params;
      const oracleHeader = headers.get("X-Is-oracle");

      const expectedOracleHeader = process.env.ORACLE_HEADER || randomUUID();

      if (oracleHeader !== expectedOracleHeader) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const examIdNum = Number(examId);
      if (isNaN(examIdNum)) {
        return new Response(JSON.stringify({ error: "Invalid exam ID" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const examResult = await dbGetExamAttemptById(examIdNum, userId);
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

      const userName = await dbGetNameByIdString(userId);

      const pdfBuffer = generateCertificate({
        userName: userName.name,
        examName: examData.title,
        date: examResult.submittedAt.toISOString().split("T")[0],
      });

      const fileName = `${userName.name}-${examData.title}-certificate.pdf`;

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
