import { jsPDF } from "jspdf";
import { dbGetExamById } from "~/db/service/exam";
import { dbGetExamAttemptById } from "~/db/service/examAttempt";
import { dbGetNameByIdString } from "~/db/service/user";

type GenerateCertificateParams = {
  userName: string;
  examName: string;
  date: string;
};

export const generateCertificate = ({
  userName,
  examName,
  date,
}: GenerateCertificateParams) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setDrawColor(0);
  doc.setLineWidth(1.5);
  doc.rect(10, 10, 277, 190);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  doc.text("Certificate of Completion", pageWidth / 2, 45, { align: "center" });

  doc.setFontSize(18);
  doc.setFont("helvetica", "normal");
  doc.text("This is to certify that", pageWidth / 2, 65, { align: "center" });

  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 102, 204);
  doc.text(userName, pageWidth / 2, 85, { align: "center" });

  doc.setFontSize(18);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text("has successfully completed the exam", pageWidth / 2, 100, {
    align: "center",
  });

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(50, 50, 50);
  doc.text(`"${examName}"`, pageWidth / 2, 115, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, 135, {
    align: "center",
  });

  return doc.output("arraybuffer");
};

export const ServerRoute = createServerFileRoute().methods({
  GET: async ({ request, params }) => {
    try {
      const headers = request.headers;
      const { examId, userId } = params;
      const oracleHeader = headers.get("X-Is-oracle");

      if (oracleHeader !== "1") {
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
        date: examResult.submittedAt.toISOString(),
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
