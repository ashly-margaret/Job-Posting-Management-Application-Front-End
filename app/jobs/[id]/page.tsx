"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Edit3,
  Trash2,
  ArrowLeft,
  Share2,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Job, JobType } from "@/types/job";
import { fetchJobById, deleteJob } from "@/lib/api/jobs";
import { Navbar } from "@/components/jobs/Navbar";
import { DeleteModal } from "@/components/jobs/DeleteModal";
import { useToast } from "@/components/jobs/Toast";

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const jobId = Number(unwrappedParams.id);
  const router = useRouter();
  const { showToast } = useToast();

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Apply modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyName, setApplyName] = useState("");
  const [applyEmail, setApplyEmail] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  useEffect(() => {
    if (isNaN(jobId)) {
      setError("Invalid Job ID provided");
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
          const is404 =
            err && typeof err === "object" && "statusCode" in err && (err as { statusCode: number }).statusCode === 404;
          if (is404) {
            setError(`Job #${jobId} was not found on the server.`);
          } else {
            const msg = err instanceof Error ? err.message : "Failed to load job details.";
            setError(msg);
          }
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

  const handleDelete = async () => {
    if (!job) return;
    setIsDeleting(true);
    try {
      await deleteJob(job.id);
      showToast(`Job #${job.id} was successfully deleted.`, "success");
      router.push("/jobs");
    } catch (err: unknown) {
      console.error("Delete failed:", err);
      const msg = err instanceof Error ? err.message : "Failed to delete job.";
      showToast(msg, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("Job link copied to clipboard!", "info");
    }
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyName.trim() || !applyEmail.trim()) {
      showToast("Please enter your name and email address.", "error");
      return;
    }

    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setAppliedSuccess(true);
      showToast("Application submitted successfully!", "success");
    }, 900);
  };

  const getTypeBadgeStyles = (type?: JobType) => {
    switch (type) {
      case "full-time":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "part-time":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "contract":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const formattedDate = React.useMemo(() => {
    if (!job?.createdAt) return "Recently posted";
    try {
      const d = new Date(job.createdAt);
      if (isNaN(d.getTime())) return "Recently posted";
      return d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently posted";
    }
  }, [job?.createdAt]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Jobs</span>
          </Link>

          {job && (
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80 shadow-xs transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Link</span>
            </button>
          )}
        </div>

        {/* State Management */}
        {isLoading ? (
          /* Loading Skeleton */
          <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 animate-pulse max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-200 rounded-2xl" />
              <div className="space-y-2 flex-1">
                <div className="w-1/3 h-6 bg-slate-200 rounded" />
                <div className="w-1/4 h-4 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <div className="w-full h-4 bg-slate-100 rounded" />
              <div className="w-5/6 h-4 bg-slate-100 rounded" />
              <div className="w-4/6 h-4 bg-slate-100 rounded" />
            </div>
          </div>
        ) : error || !job ? (
          /* Error or 404 State */
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-12 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Job Not Found</h2>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              {error || "The job posting you are looking for does not exist or has been removed."}
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/jobs"
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
              >
                Return to Job Directory
              </Link>
            </div>
          </div>
        ) : (
          /* Job Content */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Card */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-indigo-50 to-indigo-100/70 border border-indigo-200/60 flex items-center justify-center text-indigo-700 font-extrabold text-xl tracking-wider shrink-0 shadow-xs">
                      {job.company
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">
                        {job.company}
                      </span>
                      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                        {job.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {job.location}
                        </span>
                        <span className="text-slate-300">&bull;</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Posted {formattedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border capitalize self-start ${getTypeBadgeStyles(
                      job.type
                    )}`}
                  >
                    {job.type}
                  </span>
                </div>

                {/* Primary Compensation Banner */}
                <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Offered Compensation
                    </span>
                    <p className="text-xl font-black text-slate-900 flex items-center gap-1 mt-0.5">
                      <DollarSign className="w-5 h-5 text-indigo-600" />
                      {typeof job.salary === "number" && job.salary > 0
                        ? `${job.salary.toLocaleString()} / year`
                        : "Competitive Market Salary"}
                    </p>
                  </div>

                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 active:scale-95 transition cursor-pointer"
                  >
                    Apply for this Position
                  </button>
                </div>
              </div>

              {/* Description Card */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                  <span>About the Position</span>
                </h2>
                <div className="pt-2 text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line border-t border-slate-100">
                  {job.description}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Sidebar & Metadata */}
            <div className="space-y-6">
              {/* Management Actions Card */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Listing Management
                </h3>
                <div className="flex flex-col gap-2.5">
                  <Link
                    href={`/jobs/${job.id}/edit`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200/70 hover:border-indigo-200 transition"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Job Posting</span>
                  </Link>

                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition active:scale-95 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Posting</span>
                  </button>
                </div>
              </div>

              {/* Job Specifications Summary */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4 text-xs">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Posting Specifications
                </h3>
                <div className="space-y-3.5 divide-y divide-slate-100">
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Job Reference ID</span>
                    <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      #{job.id}
                    </span>
                  </div>
                  <div className="pt-3 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Company</span>
                    <span className="font-semibold text-slate-900">{job.company}</span>
                  </div>
                  <div className="pt-3 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Location</span>
                    <span className="font-semibold text-slate-900">{job.location}</span>
                  </div>
                  <div className="pt-3 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Employment Type</span>
                    <span className="font-semibold capitalize text-slate-900">
                      {job.type}
                    </span>
                  </div>
                  <div className="pt-3 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Backend Endpoint</span>
                    <span className="font-mono text-[11px] text-indigo-600">
                      /jobs/{job.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Delete Modal */}
      <DeleteModal
        job={job}
        isOpen={showDeleteModal}
        isLoading={isDeleting}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />

      {/* Apply Simulation Modal */}
      {showApplyModal && job && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 sm:p-8">
              {appliedSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Application Transmitted!
                  </h3>
                  <p className="text-sm text-slate-600 max-w-sm mx-auto">
                    Thank you, <span className="font-semibold">{applyName}</span>. Your application for <span className="font-semibold">{job.title}</span> at <span className="font-semibold">{job.company}</span> has been simulated successfully.
                  </p>
                  <button
                    onClick={() => {
                      setShowApplyModal(false);
                      setAppliedSuccess(false);
                      setApplyName("");
                      setApplyEmail("");
                    }}
                    className="mt-4 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Apply for {job.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Submitting your candidate profile to {job.company}.
                    </p>
                  </div>

                  <div className="space-y-3.5 pt-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Morgan"
                        value={applyName}
                        onChange={(e) => setApplyName(e.target.value)}
                        className="w-full p-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. alex@example.com"
                        value={applyEmail}
                        onChange={(e) => setApplyEmail(e.target.value)}
                        className="w-full p-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowApplyModal(false)}
                      className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition disabled:opacity-50"
                    >
                      {isApplying && <Loader2 className="w-4 h-4 animate-spin" />}
                      <span>{isApplying ? "Submitting..." : "Submit Application"}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
