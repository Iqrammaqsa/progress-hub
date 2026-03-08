export type ReportItemData = {
  id: string;
  image: File | null;
  imagePreviewUrl: string | null;
  featurePage: string;
  description: string;
};

export type DailyReportData = {
  title: string;
  items: ReportItemData[];
};
