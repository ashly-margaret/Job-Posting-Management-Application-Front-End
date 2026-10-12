"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  Edit3,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { Job, JobType } from "@/types/job";

interface JobCardProps {
  job: Job;
  viewMode?: "grid" | "list";
  onDeleteRequest: (job: Job) => void;
}

export function JobCard({
  job,
  viewMode = "grid",
  onDeleteRequest,
}: JobCardProps) {
  const getTypeBadgeStyles = (type: JobType) => {
    switch (type) {
      case "full-time":
        return "bg-blue-50 text-blue-700 border-blue-200/80";
      case "part-time":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      case "contract":
        return "bg-amber-50 text-amber-700 border-amber-200/80";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getCompanyInitials = (name: string) => {
    if (!name) return "CO";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const formattedDate = React.useMemo(() => {
    if (!job.createdAt) return "Recent";
    try {
      const d = new Date(job.createdAt);
      if (isNaN(d.getTime())) return "Recent";
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays}d ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "Recent";
    }
  }, [job.createdAt]);

  const formattedSalary =
    typeof job.salary === "number" && job.salary > 0
      ? `$${job.salary.toLocaleString()} / yr`
      : "Competitive Salary";

  if (viewMode === "list") {
    return (
      <div className="group bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          {/* Company Avatar */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-slate-100 border border-slate-200/70 flex items-center justify-center text-indigo-700 font-bold text-sm tracking-wider shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            {getCompanyInitials(job.company)}
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/jobs/${job.id}`}
                className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition truncate"
              >
                {job.title}
              </Link>
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border capitalize ${getTypeBadgeStyles(
                  job.type
                )}`}
              >
                {job.type}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {job.company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {job.location}
              </span>
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                {formattedSalary}
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-end">
          <Link
            href={`/jobs/${job.id}`}
            className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200/70 hover:border-indigo-200 transition text-xs font-semibold flex items-center gap-1"
            title="View Details"
          >
            <span>View</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href={`/jobs/${job.id}/edit`}
            className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200/70 hover:border-indigo-200 transition text-xs font-semibold flex items-center gap-1"
            title="Edit Job"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </Link>
          <button
            onClick={() => onDeleteRequest(job)}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/70 hover:border-rose-200 transition text-xs font-semibold flex items-center gap-1"
            title="Delete Job"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>
    );
  }

  // Grid Card View
  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      {/* Top Accent Gradient Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Header: Company & Badges */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-50 to-slate-100 border border-slate-200/80 flex items-center justify-center text-indigo-700 font-bold text-sm tracking-wider shadow-xs group-hover:scale-105 transition-transform">
              {getCompanyInitials(job.company)}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-slate-400" />
                {job.company}
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                {job.location}
              </p>
            </div>
          </div>

          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border capitalize shrink-0 ${getTypeBadgeStyles(
              job.type
            )}`}
          >
            {job.type}
          </span>
        </div>

        {/* Title */}
        <Link
          href={`/jobs/${job.id}`}
          className="block font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1"
        >
          {job.title}
        </Link>

        {/* Description Snippet */}
        <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Key Pills: Salary & Date */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="font-bold text-slate-800 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
            <span>{formattedSalary}</span>
          </div>
          <div className="text-slate-400 flex items-center gap-1 text-[11px]">
            <Calendar className="w-3 h-3" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          href={`/jobs/${job.id}`}
          className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-center bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200/80 hover:border-indigo-200 transition flex items-center justify-center gap-1"
        >
          <span>View Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href={`/jobs/${job.id}/edit`}
            className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 border border-slate-200/70 transition"
            title="Edit Job"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => onDeleteRequest(job)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/70 transition"
            title="Delete Job"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
