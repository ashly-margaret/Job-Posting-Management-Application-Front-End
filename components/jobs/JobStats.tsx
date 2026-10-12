"use client";

import React from "react";
import { Briefcase, Clock, CalendarCheck, DollarSign, TrendingUp } from "lucide-react";
import { Job } from "@/types/job";

interface JobStatsProps {
  jobs: Job[];
}

export function JobStats({ jobs }: JobStatsProps) {
  const total = jobs.length;
  const fullTime = jobs.filter((j) => j.type === "full-time").length;
  const partTime = jobs.filter((j) => j.type === "part-time").length;
  const contract = jobs.filter((j) => j.type === "contract").length;

  const salariedJobs = jobs.filter((j) => typeof j.salary === "number" && j.salary > 0);
  const avgSalary =
    salariedJobs.length > 0
      ? Math.round(
          salariedJobs.reduce((acc, curr) => acc + (curr.salary || 0), 0) /
            salariedJobs.length
        )
      : null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-8">
      {/* Total Active Jobs */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Jobs
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>
        <p className="mt-2 text-2xl font-black text-slate-900 tracking-tight">
          {total}
        </p>
        <span className="text-[11px] text-slate-400 font-medium">
          Active listings
        </span>
      </div>

      {/* Full Time */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Full-Time
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <p className="mt-2 text-2xl font-black text-blue-900 tracking-tight">
          {fullTime}
        </p>
        <span className="text-[11px] text-blue-500 font-medium">
          {total > 0 ? `${Math.round((fullTime / total) * 100)}% of total` : "0%"}
        </span>
      </div>

      {/* Part Time */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Part-Time
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <p className="mt-2 text-2xl font-black text-emerald-900 tracking-tight">
          {partTime}
        </p>
        <span className="text-[11px] text-emerald-600 font-medium">
          Flexible schedules
        </span>
      </div>

      {/* Contract */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Contract
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <CalendarCheck className="w-4 h-4" />
          </div>
        </div>
        <p className="mt-2 text-2xl font-black text-amber-900 tracking-tight">
          {contract}
        </p>
        <span className="text-[11px] text-amber-600 font-medium">
          Freelance / project
        </span>
      </div>

      {/* Average Salary */}
      <div className="col-span-2 md:col-span-4 lg:col-span-1 p-4 rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white border border-indigo-800 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
            Avg. Salary
          </span>
          <div className="w-8 h-8 rounded-lg bg-white/10 text-indigo-300 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <p className="mt-2 text-2xl font-black text-white tracking-tight">
          {avgSalary !== null ? `$${avgSalary.toLocaleString()}` : "N/A"}
        </p>
        <span className="text-[11px] text-indigo-300 font-medium">
          Based on salary data
        </span>
      </div>
    </div>
  );
}
