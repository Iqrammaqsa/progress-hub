"use client";

import { ChangeEvent, useRef } from "react";
import Image from "next/image";

import type { ReportItemData } from "@/types/report";

type ReportItemProps = {
  item: ReportItemData;
  index: number;
  onImageChange: (id: string, file: File | null) => void;
  onFeaturePageChange: (id: string, featurePage: string) => void;
  onDescriptionChange: (id: string, description: string) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
};

export default function ReportItem({
  item,
  index,
  onImageChange,
  onFeaturePageChange,
  onDescriptionChange,
  onRemove,
  canRemove,
}: ReportItemProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onImageChange(item.id, file);
  };

  const handleUndoImage = () => {
    onImageChange(item.id, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Item {index + 1}</h3>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          disabled={!canRemove}
          className="rounded-md border border-rose-300 px-3 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Remove
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <label className="mb-2 block text-sm font-medium text-slate-700">Screenshot</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
          />
          {item.imagePreviewUrl ? (
            <button
              type="button"
              onClick={handleUndoImage}
              className="rounded-md border border-amber-300 px-3 py-1 text-xs font-medium text-amber-700 transition hover:bg-amber-50"
            >
              Undo Image
            </button>
          ) : null}
          {item.imagePreviewUrl ? (
            <Image
              src={item.imagePreviewUrl}
              alt={`Preview item ${index + 1}`}
              width={250}
              height={160}
              unoptimized
              className="h-auto max-h-[200px] rounded-md border border-slate-200 object-contain"
            />
          ) : null}
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Feature/Page</label>
            <input
              type="text"
              value={item.featurePage}
              onChange={(event) => onFeaturePageChange(item.id, event.target.value)}
              placeholder="Contoh: Login, Dashboard, Settings"
              className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
          <textarea
            rows={7}
            value={item.description}
            onChange={(event) => onDescriptionChange(item.id, event.target.value)}
            placeholder="Jelaskan progress coding hari ini..."
            className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm leading-6 text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>
    </div>
  );
}
