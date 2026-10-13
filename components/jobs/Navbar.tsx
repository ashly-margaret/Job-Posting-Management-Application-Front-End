"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Plus } from "lucide-react";

export function Navbar({ backendOnline = true }: { backendOnline?: boolean | null }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full glass-nav backdrop-blur-md bg-white/80 border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link
              href="/jobs"
              className="flex items-center gap-2.5 group transition-transform active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition">
                <Briefcase className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent">
                    NextJobs
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    Portal
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  Full-Stack Job Engine
                </span>
              </div>
            </Link>

            {/* Navigation links */}
            <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-slate-200">
              <Link
                href="/jobs"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  pathname === "/jobs"
                    ? "bg-slate-100 text-indigo-600 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Browse Jobs
              </Link>
              <Link
                href="/jobs/new"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  pathname === "/jobs/new"
                    ? "bg-slate-100 text-indigo-600 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Create Listing
              </Link>
            </nav>
          </div>

          {/* Right Action & Status Indicator */}
          <div className="flex items-center gap-3">
            {/* Live Backend Connection Indicator */}
            <div
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                backendOnline === true
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : backendOnline === false
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : "bg-slate-50 text-slate-600 border-slate-200"
              }`}
              title="NestJS API running at https://job-posting-management-application-back.onrender.com/"
            >
              <span className="relative flex h-2 w-2">
                {backendOnline === true && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    backendOnline === true
                      ? "bg-emerald-500"
                      : backendOnline === false
                      ? "bg-rose-500"
                      : "bg-amber-400"
                  }`}
                ></span>
              </span>
              <span>
                {backendOnline === true
                  ? "NestJS API: Online"
                  : backendOnline === false
                  ? "NestJS API: Disconnected"
                  : "Connecting API..."}
              </span>
            </div>

            {/* Post Job CTA button */}
            <Link
              href="/jobs/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-sm hover:shadow shadow-indigo-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Post a Job</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
