"use client";

import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Job } from "@/types/job";

interface DeleteModalProps {
  job: Job | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteModal({
  job,
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Delete Job Posting?
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">
                This action is permanent and cannot be undone.
              </p>
            </div>
          </div>

          <div className="mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 text-sm">
            <p className="font-semibold text-slate-800">{job.title}</p>
            <p className="text-slate-500 text-xs mt-0.5">
              {job.company} &bull; {job.location}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 active:scale-95 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={onConfirm}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 shadow-sm hover:shadow shadow-rose-600/20 transition disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isLoading ? "Deleting..." : "Yes, Delete Job"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
