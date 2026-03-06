"use client";

import type { ReportItemData } from "@/types/report";
import Image from "next/image";

type ReportPreviewProps = {
  title: string;
  items: ReportItemData[];
};

export default function ReportPreview({ title, items }: ReportPreviewProps) {
  const hasItems = items.length > 0;

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800">
        3. Preview Report
      </h2>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="border-b border-slate-200 p-3 text-center font-semibold text-slate-700">
                Image
              </th>
              <th className="border-b border-slate-200 p-3 text-center font-semibold text-slate-700">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {!hasItems ? (
              <tr>
                <td colSpan={2} className="p-4 text-center text-slate-500">
                  Belum ada item report.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="align-top">
                  <td className="w-[40%] border-b border-slate-100 p-3">
                    {item.imagePreviewUrl ? (
                      <Image
                        src={item.imagePreviewUrl}
                        alt="Item preview"
                        width={250}
                        height={160}
                        unoptimized
                        className="h-auto max-w-[250px] rounded-md border border-slate-200 object-contain"
                      />
                    ) : (
                      <p className="text-slate-400">No image</p>
                    )}
                  </td>
                  <td className="w-[60%] border-b border-slate-100 p-3 text-slate-700">
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

      <p className="text-sm text-slate-600">
        <span className="font-semibold">Title:</span>{" "}
        {title || "Untitled Daily Report"}
      </p>
    </section>
  );
}
