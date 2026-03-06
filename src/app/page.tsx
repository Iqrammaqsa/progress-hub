"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import ReportForm from "@/components/ReportForm";
import ReportPreview from "@/components/ReportPreview";
import { exportReportToDocx } from "@/lib/exportDocx";
import { exportReportToPdf } from "@/lib/exportPdf";
import type { ReportItemData } from "@/types/report";

const createItem = (): ReportItemData => ({
  id:
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`,
  image: null,
  imagePreviewUrl: null,
  description: "",
});

export default function Home() {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<ReportItemData[]>([createItem()]);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const itemsRef = useRef(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => {
        if (item.imagePreviewUrl) {
          URL.revokeObjectURL(item.imagePreviewUrl);
        }
      });
    };
  }, []);

  const hasExportableContent = useMemo(
    () => items.some((item) => item.image || item.description.trim()),
    [items],
  );

  const handleAddItem = () => {
    setItems((previous) => [...previous, createItem()]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((previous) => {
      if (previous.length === 1) {
        return previous;
      }

      const itemToRemove = previous.find((item) => item.id === id);
      if (itemToRemove?.imagePreviewUrl) {
        URL.revokeObjectURL(itemToRemove.imagePreviewUrl);
      }

      return previous.filter((item) => item.id !== id);
    });
  };

  const handleImageChange = (id: string, file: File | null) => {
    setItems((previous) =>
      previous.map((item) => {
        if (item.id !== id) {
          return item;
        }

        if (item.imagePreviewUrl) {
          URL.revokeObjectURL(item.imagePreviewUrl);
        }

        return {
          ...item,
          image: file,
          imagePreviewUrl: file ? URL.createObjectURL(file) : null,
        };
      }),
    );
  };

  const handleDescriptionChange = (id: string, description: string) => {
    setItems((previous) =>
      previous.map((item) => (item.id === id ? { ...item, description } : item)),
    );
  };

  const handleExportPdf = async () => {
    if (!hasExportableContent) {
      return;
    }

    setIsExportingPdf(true);
    try {
      await exportReportToPdf(title, items);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportDocx = async () => {
    if (!hasExportableContent) {
      return;
    }

    setIsExportingDocx(true);
    try {
      await exportReportToDocx(title, items);
    } finally {
      setIsExportingDocx(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl rounded-xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
        <header className="mb-8 border-b border-slate-200 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Progress Hub
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Daily Development Report Generator
          </p>
        </header>

        <div className="space-y-8">
          <ReportForm
            title={title}
            items={items}
            onTitleChange={setTitle}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onImageChange={handleImageChange}
            onDescriptionChange={handleDescriptionChange}
          />

          <ReportPreview title={title} items={items} />

          <section className="space-y-3 rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-900">Export Report</h2>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={!hasExportableContent || isExportingPdf}
                className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isExportingPdf ? "Exporting PDF..." : "Export PDF"}
              </button>
              <button
                type="button"
                onClick={handleExportDocx}
                disabled={!hasExportableContent || isExportingDocx}
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isExportingDocx ? "Exporting DOCX..." : "Export DOCX"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
