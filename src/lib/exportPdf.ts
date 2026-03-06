import { jsPDF } from "jspdf";

import type { ReportItemData } from "@/types/report";

const PAGE_MARGIN = 14;
const TITLE_Y = 20;
const TABLE_START_Y = 30;
const IMAGE_MAX_WIDTH = 70;
const ROW_MIN_HEIGHT = 42;

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Gagal membaca file gambar."));
    reader.readAsDataURL(file);
  });

export const exportReportToPdf = async (title: string, items: ReportItemData[]) => {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const descriptionX = PAGE_MARGIN + IMAGE_MAX_WIDTH + 4;
  const descriptionWidth = pageWidth - descriptionX - PAGE_MARGIN;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(title || "Untitled Daily Report", PAGE_MARGIN, TITLE_Y);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.rect(PAGE_MARGIN, TABLE_START_Y, IMAGE_MAX_WIDTH + 4, 10);
  doc.rect(descriptionX, TABLE_START_Y, descriptionWidth, 10);
  doc.text("Image", PAGE_MARGIN + 3, TABLE_START_Y + 6.5);
  doc.text("Description", descriptionX + 3, TABLE_START_Y + 6.5);

  let currentY = TABLE_START_Y + 10;

  for (const item of items) {
    const descriptionLines = doc.splitTextToSize(
      item.description || "No description",
      descriptionWidth - 6,
    );
    const descriptionHeight = Math.max(descriptionLines.length * 5 + 6, ROW_MIN_HEIGHT);
    const rowHeight = descriptionHeight;

    if (currentY + rowHeight > pageHeight - PAGE_MARGIN) {
      doc.addPage();
      currentY = PAGE_MARGIN;
    }

    doc.rect(PAGE_MARGIN, currentY, IMAGE_MAX_WIDTH + 4, rowHeight);
    doc.rect(descriptionX, currentY, descriptionWidth, rowHeight);

    if (item.image) {
      const imageDataUrl = await fileToDataUrl(item.image);
      const imageFormat = item.image.type.includes("png") ? "PNG" : "JPEG";
      doc.addImage(
        imageDataUrl,
        imageFormat,
        PAGE_MARGIN + 2,
        currentY + 2,
        IMAGE_MAX_WIDTH,
        rowHeight - 4,
        undefined,
        "FAST",
      );
    } else {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(128);
      doc.text("No image", PAGE_MARGIN + 3, currentY + 7);
      doc.setTextColor(0);
    }

    doc.setFont("helvetica", "normal");
    doc.text(descriptionLines, descriptionX + 3, currentY + 7);

    currentY += rowHeight;
  }

  doc.save(`${(title || "daily-report").replace(/\s+/g, "-").toLowerCase()}.pdf`);
};
