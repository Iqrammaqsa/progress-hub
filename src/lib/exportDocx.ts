import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";
import type { ParagraphChild } from "docx";

import type { ReportItemData } from "@/types/report";

const IMAGE_COLUMN_PERCENT = 35;
const DESCRIPTION_COLUMN_PERCENT = 65;
const IMAGE_MAX_WIDTH = 220;
const IMAGE_MAX_HEIGHT = 150;

type Base64Image = {
  base64: string;
  width: number;
  height: number;
  type: "jpg" | "png" | "gif" | "bmp";
};

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });

const getImageDimensions = (dataUrl: string): Promise<{ width: number; height: number }> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.width, height: image.height });
    image.onerror = () => reject(new Error("Failed to load image dimensions."));
    image.src = dataUrl;
  });

const toDocxImageType = (mimeType: string): "jpg" | "png" | "gif" | "bmp" => {
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

const dataUrlToBase64 = (dataUrl: string): string => dataUrl.split(",")[1] ?? "";

const base64ToUint8Array = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);

  for (let index = 0; index < binaryString.length; index += 1) {
    bytes[index] = binaryString.charCodeAt(index);
  }

  return bytes;
};

const getScaledSize = (width: number, height: number) => {
  const imageRatio = width / height;
  const boxRatio = IMAGE_MAX_WIDTH / IMAGE_MAX_HEIGHT;

  if (imageRatio > boxRatio) {
    return {
      width: IMAGE_MAX_WIDTH,
      height: Math.round(IMAGE_MAX_WIDTH / imageRatio),
    };
  }

  return {
    width: Math.round(IMAGE_MAX_HEIGHT * imageRatio),
    height: IMAGE_MAX_HEIGHT,
  };
};

const getBase64Image = async (file: File): Promise<Base64Image> => {
  const dataUrl = await fileToDataUrl(file);
  const dimensions = await getImageDimensions(dataUrl);

  return {
    base64: dataUrlToBase64(dataUrl),
    width: dimensions.width,
    height: dimensions.height,
    type: toDocxImageType(file.type),
  };
};

const createCellBorders = () => ({
  top: { style: BorderStyle.SINGLE, color: "D1D5DB", size: 1 },
  bottom: { style: BorderStyle.SINGLE, color: "D1D5DB", size: 1 },
  left: { style: BorderStyle.SINGLE, color: "D1D5DB", size: 1 },
  right: { style: BorderStyle.SINGLE, color: "D1D5DB", size: 1 },
});

const createHeaderCell = (text: string, widthPercent: number) =>
  new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    borders: createCellBorders(),
    shading: { fill: "F8FAFC" },
    margins: { top: 120, bottom: 120, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: true, size: 22 })],
      }),
    ],
  });

const createBodyCell = (widthPercent: number, children: ParagraphChild[], alignCenter?: boolean) =>
  new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    borders: createCellBorders(),
    margins: { top: 120, bottom: 120, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        alignment: alignCenter ? AlignmentType.CENTER : AlignmentType.LEFT,
        children,
        spacing: { line: 320 },
      }),
    ],
  });

const buildItemRow = async (item: ReportItemData) => {
  const description = item.description.trim() || "No description";

  let imageChildren: ParagraphChild[];
  if (item.image) {
    const base64Image = await getBase64Image(item.image);
    const scaled = getScaledSize(base64Image.width, base64Image.height);

    imageChildren = [
      new ImageRun({
        data: base64ToUint8Array(base64Image.base64),
        type: base64Image.type,
        transformation: {
          width: scaled.width,
          height: scaled.height,
        },
      }),
    ];
  } else {
    imageChildren = [new TextRun({ text: "No image", italics: true, color: "6B7280" })];
  }

  const descriptionChildren = [new TextRun({ text: description, size: 22 })];

  return new TableRow({
    children: [
      createBodyCell(IMAGE_COLUMN_PERCENT, imageChildren, true),
      createBodyCell(DESCRIPTION_COLUMN_PERCENT, descriptionChildren),
    ],
  });
};

export const exportReportToDocx = async (title: string, items: ReportItemData[]) => {
  const generatedDate = new Date().toLocaleString();
  const tableRows: TableRow[] = [
    new TableRow({
      children: [
        createHeaderCell("Image", IMAGE_COLUMN_PERCENT),
        createHeaderCell("Description", DESCRIPTION_COLUMN_PERCENT),
      ],
    }),
  ];

  for (const item of items) {
    tableRows.push(await buildItemRow(item));
  }

  const docFile = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: "Daily Development Report",
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 140 },
          }),
          new Paragraph({
            children: [new TextRun({ text: `Report Title: ${title || "Untitled Daily Report"}` })],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [new TextRun({ text: `Generated Date: ${generatedDate}` })],
            spacing: { after: 260 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows,
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
