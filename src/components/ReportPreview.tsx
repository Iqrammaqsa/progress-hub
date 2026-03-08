"use client";

import type { ReportItemData } from "@/types/report";
import Image from "next/image";

type ReportPreviewProps = {
  title: string;
  items: ReportItemData[];
};

export default function ReportPreview({ title, items }: ReportPreviewProps) {
  const hasItems = items.length > 0;
  const generatedDate = new Date().toLocaleString();

  return (
    <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Preview Report</h2>
        <p className="mt-1 text-sm text-slate-500">
          Final layout before export
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full border-collapse text-sm text-slate-700">
          <thead className="bg-slate-50">
            <tr>
              <th className="border-b border-slate-200 p-3 text-left font-semibold text-slate-700">
                Image
              </th>
              <th className="border-b border-slate-200 p-3 text-left font-semibold text-slate-700">
                Feature/Page
              </th>
              <th className="border-b border-slate-200 p-3 text-left font-semibold text-slate-700">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {!hasItems ? (
              <tr>
                <td colSpan={3} className="p-6 text-center text-slate-500">
                  Belum ada item report.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="align-top">
                  <td className="w-[35%] border-b border-slate-100 p-4">
                    {item.imagePreviewUrl ? (
                      <Image
                        src={item.imagePreviewUrl}
                        alt="Item preview"
                        width={250}
                        height={160}
                        unoptimized
                        className="h-auto max-h-[200px] max-w-[250px] rounded-md border border-slate-200 object-contain"
                      />
                    ) : (
                      <p className="text-slate-400">No image</p>
                    )}
                  </td>
                  <td className="w-[20%] border-b border-slate-100 p-4 align-middle leading-6">
                    {item.featurePage || (
                      <span className="text-slate-400">No feature/page</span>
                    )}
                  </td>
                  <td className="w-[45%] border-b border-slate-100 p-4 align-middle leading-6">
                    {item.description || (
                      <span className="text-slate-400">No description</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-slate-600">
        <p>
          <span className="font-semibold">Report:</span>{" "}
          {title || "Untitled Daily Report"}
        </p>
        <p suppressHydrationWarning>
          <span className="font-semibold"> Date:</span> {generatedDate}
        </p>
      </div>
    </section>
  );
}
