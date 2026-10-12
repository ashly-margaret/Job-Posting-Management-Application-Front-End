"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Job } from "@/types/job";
import { fetchJobById } from "@/lib/api/jobs";
import { Navbar } from "@/components/jobs/Navbar";
import { JobForm } from "@/components/jobs/JobForm";

export default function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const jobId = Number(unwrappedParams.id);

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNaN(jobId)) {
      setError("Invalid Job ID provided.");
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const loadJob = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchJobById(jobId);
        if (isMounted) setJob(data);
      } catch (err: unknown) {
        if (isMounted) {
          const msg =
            err instanceof Error ? err.message : "Failed to load job for editing.";
          setError(msg);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadJob();
    return () => {
      isMounted = false;
    };
  }, [jobId]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4 animate-pulse max-w-4xl mx-auto">
            <div className="w-1/3 h-6 bg-slate-200 rounded" />
            <div className="w-2/3 h-4 bg-slate-100 rounded" />
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="h-10 bg-slate-100 rounded" />
              <div className="h-10 bg-slate-100 rounded" />
            </div>
          </div>
        ) : error || !job ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Job Not Found</h3>
            <p className="text-xs text-slate-500 mt-1">{error || "Could not find job to edit."}</p>
            <Link
              href="/jobs"
              className="mt-4 inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Job Listings</span>
            </Link>
          </div>
        ) : (
          <JobForm mode="edit" initialJob={job} />
        )}
      </main>
    </div>
  );
}
