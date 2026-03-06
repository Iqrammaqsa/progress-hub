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
    <section className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">1. Report Title</h2>
        <input
          type="text"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Contoh: Daily Report - 6 Maret 2026"
          className="mt-3 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">2. Report Items</h2>
          <button
            type="button"
            onClick={onAddItem}
            className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
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

