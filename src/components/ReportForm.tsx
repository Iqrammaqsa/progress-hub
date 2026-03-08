"use client";

import ReportItem from "@/components/ReportItem";
import type { ReportItemData } from "@/types/report";

type ReportFormProps = {
  title: string;
  items: ReportItemData[];
  onTitleChange: (value: string) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onImageChange: (id: string, file: File | null) => void;
  onDescriptionChange: (id: string, description: string) => void;
};

export default function ReportForm({
  title,
  items,
  onTitleChange,
  onAddItem,
  onRemoveItem,
  onImageChange,
  onDescriptionChange,
}: ReportFormProps) {
  return (
    <section className="space-y-6">
      <div>
        <label
          htmlFor="report-title"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Report Title
        </label>
        <input
          id="report-title"
          type="text"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Contoh: Daily Report - 6 Maret 2026"
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Report Items</h2>
          <button
            type="button"
            onClick={onAddItem}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            <span aria-hidden>+</span>
            Add Item
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <ReportItem
              key={item.id}
              item={item}
              index={index}
              onImageChange={onImageChange}
              onDescriptionChange={onDescriptionChange}
              onRemove={onRemoveItem}
              canRemove={items.length > 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
