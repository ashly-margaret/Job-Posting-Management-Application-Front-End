"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Briefcase,
  Plus,
  RefreshCw,
  Sparkles,
  SearchX,
  AlertCircle,
  Database,
} from "lucide-react";
import { Job, CreateJobInput } from "@/types/job";
import { fetchJobs, deleteJob, createJob } from "@/lib/api/jobs";
import { Navbar } from "@/components/jobs/Navbar";
import { JobStats } from "@/components/jobs/JobStats";
import { JobFilterBar, FilterState } from "@/components/jobs/JobFilterBar";
import { JobCard } from "@/components/jobs/JobCard";
import { DeleteModal } from "@/components/jobs/DeleteModal";
import { useToast } from "@/components/jobs/Toast";

const DEMO_JOBS: CreateJobInput[] = [
  // {
  //   title: "Senior Full Stack Engineer",
  //   company: "Vercel Partner Labs",
  //   location: "Remote (Global)",
  //   salary: 155000,
  //   type: "full-time",
  //   description:
  //     "Looking for a seasoned Full Stack Engineer with extensive experience in Next.js 15, TypeScript, Tailwind CSS, and NestJS backends. You will architect high-throughput applications and lead our core product initiatives.",
  // },
  // {
  //   title: "Backend Microservices Architect",
  //   company: "CloudCore Systems",
  //   location: "New York, NY (Hybrid)",
  //   salary: 165000,
  //   type: "full-time",
  //   description:
  //     "Join our infrastructure team to design scalable microservices using NestJS, PostgreSQL, Redis, and Docker. Responsibilities include building robust REST and GraphQL APIs with comprehensive testing suites.",
  // },
  // {
  //   title: "UI/UX & Frontend Developer",
  //   company: "DesignCraft Studio",
  //   location: "Austin, TX",
  //   salary: 95000,
  //   type: "part-time",
  //   description:
  //     "Craft bespoke visual designs, design systems, and fluid component interactions using modern React, Tailwind CSS, and Framer Motion. Ideal for designers who code and care about micro-interactions.",
  // },
  // {
  //   title: "DevOps & Cloud Specialist",
  //   company: "Apex Infotech",
  //   location: "Remote",
  //   salary: 130000,
  //   type: "contract",
  //   description:
  //     "6-month contract to configure Kubernetes deployments, CI/CD automated test pipelines, and cloud monitoring for our enterprise clients. Strong AWS and Terraform background required.",
  // },
];

export default function JobsPage() {
  const { showToast } = useToast();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Filter & Search State
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    type: "all",
    sortBy: "newest",
    viewMode: "grid",
  });

  // Delete modal state
  const [deleteCandidate, setDeleteCandidate] = useState<Job | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Guard to guarantee the API is only called once on initial page mount
  const hasFetched = useRef(false);

  // Load jobs from API
  const loadJobs = useCallback(async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    setError(null);

    try {
      const data = await fetchJobs();
      setJobs(data);
    } catch (err: unknown) {
      console.error("Error loading jobs:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Unable to reach NestJS backend at https://job-posting-management-application-back.onrender.com";
      setError(msg);
    } finally {
      if (!quiet) setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    loadJobs();
  }, [loadJobs]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadJobs(true);
    showToast("Job listings refreshed", "info");
  };

  // Seed sample jobs
  const handleSeedDemoJobs = async () => {
    setIsSeeding(true);
    try {
      for (const sample of DEMO_JOBS) {
        await createJob(sample);
      }
      showToast("Successfully seeded 4 demo jobs!", "success");
      await loadJobs(true);
    } catch (err: unknown) {
      console.error("Error seeding jobs:", err);
      const msg = err instanceof Error ? err.message : "Failed to seed demo jobs";
      showToast(msg, "error");
    } finally {
      setIsSeeding(false);
    }
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;

    setIsDeleting(true);
    try {
      await deleteJob(deleteCandidate.id);
      showToast(`Deleted "${deleteCandidate.title}"`, "success");
      setJobs((prev) => prev.filter((j) => j.id !== deleteCandidate.id));
      setDeleteCandidate(null);
    } catch (err: unknown) {
      console.error("Delete error:", err);
      const msg =
        err instanceof Error ? err.message : "Failed to delete job posting";
      showToast(msg, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered and Sorted Jobs
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // Search query filter
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (filters.type !== "all") {
      result = result.filter((j) => j.type === filters.type);
    }

    // Sorting
    result.sort((a, b) => {
      if (filters.sortBy === "newest") {
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      }
      if (filters.sortBy === "oldest") {
        return (
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime()
        );
      }
      if (filters.sortBy === "salary-desc") {
        return (b.salary || 0) - (a.salary || 0);
      }
      if (filters.sortBy === "salary-asc") {
        return (a.salary || 0) - (b.salary || 0);
      }
      return 0;
    });

    return result;
  }, [jobs, filters]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar backendOnline={!error} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Full-Stack Next.js 15 + NestJS Application</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Job Postings Dashboard
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
              Browse, create, update, and manage career opportunities in real-time.
              Connected directly to your NestJS REST API.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 shadow-xs transition active:scale-95 disabled:opacity-50"
              title="Refresh listings from backend"
            >
              <RefreshCw
                className={`w-4 h-4 text-slate-500 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
              <span>Refresh</span>
            </button>

            {jobs.length === 0 && (
              <button
                onClick={handleSeedDemoJobs}
                disabled={isSeeding}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 shadow-xs transition active:scale-95 disabled:opacity-50"
              >
                <Database className="w-4 h-4" />
                <span>{isSeeding ? "Seeding..." : "Seed Demo Jobs"}</span>
              </button>
            )}

            <Link
              href="/jobs/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow shadow-indigo-600/20 active:scale-95 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Post a Job</span>
            </Link>
          </div>
        </div>

        {/* Live Metrics Stats Bar */}
        <JobStats jobs={jobs} />

        {/* Filter and Search Controls */}
        <JobFilterBar
          filters={filters}
          onChange={setFilters}
          totalFiltered={filteredJobs.length}
        />

        {/* Content Section: Loading, Error, Empty, or Cards */}
        {isLoading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-slate-200 rounded-xl" />
                    <div className="space-y-1.5">
                      <div className="w-24 h-3 bg-slate-200 rounded" />
                      <div className="w-16 h-2.5 bg-slate-100 rounded" />
                    </div>
                  </div>
                  <div className="w-16 h-5 bg-slate-100 rounded-full" />
                </div>
                <div className="w-3/4 h-5 bg-slate-200 rounded" />
                <div className="space-y-1">
                  <div className="w-full h-3 bg-slate-100 rounded" />
                  <div className="w-5/6 h-3 bg-slate-100 rounded" />
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between">
                  <div className="w-20 h-4 bg-slate-200 rounded" />
                  <div className="w-16 h-4 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center max-w-xl mx-auto my-12">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-rose-900">
              Could Not Connect to Backend
            </h3>
            <p className="text-sm text-rose-700 mt-1 mb-4 leading-relaxed">
              {error}
            </p>
            <p className="text-xs text-rose-600 mb-6 bg-white/60 p-2.5 rounded-xl">
              Make sure your NestJS server is running on{" "}
              <code className="font-mono font-bold">http://localhost:5000</code>.
            </p>
            <button
              onClick={() => loadJobs()}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700 transition shadow-sm"
            >
              Try Again
            </button>
          </div>
        ) : jobs.length === 0 ? (
          /* Empty Database State */
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-2xl mx-auto my-8">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              No Job Postings Found
            </h3>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
              Your NestJS backend is connected and ready. You can post your first job
              opening or click the button below to seed demo postings.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/jobs/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md shadow-indigo-600/20 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Job</span>
              </Link>
              <button
                onClick={handleSeedDemoJobs}
                disabled={isSeeding}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition active:scale-95 disabled:opacity-50"
              >
                <Database className="w-4 h-4" />
                <span>{isSeeding ? "Seeding..." : "Seed 4 Sample Jobs"}</span>
              </button>
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
          /* No Search Results */
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <SearchX className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No matching jobs found
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search terms or filters.
            </p>
            <button
              onClick={() =>
                setFilters({
                  search: "",
                  type: "all",
                  sortBy: "newest",
                  viewMode: filters.viewMode,
                })
              }
              className="mt-4 px-4 py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          /* Render Job Cards */
          <div
            className={
              filters.viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                : "flex flex-col gap-3.5"
            }
          >
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                viewMode={filters.viewMode}
                onDeleteRequest={(targetJob) => setDeleteCandidate(targetJob)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        job={deleteCandidate}
        isOpen={deleteCandidate !== null}
        isLoading={isDeleting}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
