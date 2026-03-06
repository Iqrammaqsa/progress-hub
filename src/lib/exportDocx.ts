import {
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";

import type { ReportItemData } from "@/types/report";

const IMAGE_WIDTH = 250;
const IMAGE_HEIGHT = 150;

const getDocxImageType = (mimeType: string): "jpg" | "png" | "gif" | "bmp" => {
  if (mimeType.includes("jpeg") || mimeType.includes("jpg")) {
    return "jpg";
  }
  if (mimeType.includes("gif")) {
    return "gif";
  }
  if (mimeType.includes("bmp")) {
    return "bmp";
  }
  return "png";
};

const reportItemToRow = async (item: ReportItemData) => {
  let imageChild: Paragraph;

  if (item.image) {
    const imageBuffer = await item.image.arrayBuffer();
    imageChild = new Paragraph({
      children: [
        new ImageRun({
          data: imageBuffer,
          type: getDocxImageType(item.image.type),
          transformation: {
            width: IMAGE_WIDTH,
            height: IMAGE_HEIGHT,
          },
        }),
      ],
    });
  } else {
    imageChild = new Paragraph("No image");
  }

  const descriptionChild = new Paragraph({
    children: [new TextRun(item.description || "No description")],
  });

  return new TableRow({
    children: [
      new TableCell({
        width: {
          size: 40,
          type: WidthType.PERCENTAGE,
        },
        children: [imageChild],
      }),
      new TableCell({
        width: {
          size: 60,
          type: WidthType.PERCENTAGE,
        },
        children: [descriptionChild],
      }),
    ],
  });
};

export const exportReportToDocx = async (title: string, items: ReportItemData[]) => {
  const rows: TableRow[] = [
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: "Image", bold: true })] })],
        }),
        new TableCell({
          children: [
            new Paragraph({ children: [new TextRun({ text: "Description", bold: true })] }),
          ],
        }),
      ],
    }),
  ];

  for (const item of items) {
    rows.push(await reportItemToRow(item));
  }

  const docFile = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: title || "Untitled Daily Report",
            heading: HeadingLevel.HEADING_1,
          }),
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows,
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(docFile);
  const filename = `${(title || "daily-report").replace(/\s+/g, "-").toLowerCase()}.docx`;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};
