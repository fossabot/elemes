import { jsPDF } from "jspdf";

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
  doc.text(`Date: ${date}`, pageWidth / 2, 135, {
    align: "center",
  });

  return doc.output("arraybuffer");
};
