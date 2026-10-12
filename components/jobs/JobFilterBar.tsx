"use client";

import React from "react";
import { Search, RotateCcw, LayoutGrid, List } from "lucide-react";
import { JobType } from "@/types/job";

export interface FilterState {
  search: string;
  type: "all" | JobType;
  sortBy: "newest" | "oldest" | "salary-desc" | "salary-asc";
  viewMode: "grid" | "list";
}

interface JobFilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalFiltered: number;
}

export function JobFilterBar({
  filters,
  onChange,
  totalFiltered,
}: JobFilterBarProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleTypeChange = (type: "all" | JobType) => {
    onChange({ ...filters, type });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...filters,
      sortBy: e.target.value as FilterState["sortBy"],
    });
  };

  const handleViewChange = (viewMode: "grid" | "list") => {
    onChange({ ...filters, viewMode });
  };

  const resetFilters = () => {
    onChange({
      search: "",
      type: "all",
      sortBy: "newest",
      viewMode: filters.viewMode,
    });
  };

  const hasActiveFilters = filters.search !== "" || filters.type !== "all" || filters.sortBy !== "newest";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm mb-6 space-y-3.5">
      {/* Top row: Search input & View switcher */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by job title, company, location or keyword..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 justify-between md:justify-end">
          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 hidden sm:inline">
              Sort:
            </span>
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="py-2 px-3 text-xs sm:text-sm font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-slate-700 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="salary-desc">Highest Salary</option>
              <option value="salary-asc">Lowest Salary</option>
            </select>
          </div>

          {/* Grid / List toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => handleViewChange("grid")}
              title="Grid View"
              className={`p-1.5 rounded-lg transition ${
                filters.viewMode === "grid"
                  ? "bg-white text-indigo-600 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleViewChange("list")}
              title="List View"
              className={`p-1.5 rounded-lg transition ${
                filters.viewMode === "list"
                  ? "bg-white text-indigo-600 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row: Job Type Tabs & Results count */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 mr-1.5 uppercase tracking-wider">
            Type:
          </span>
          {(["all", "full-time", "part-time", "contract"] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleTypeChange(t)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition capitalize ${
                filters.type === t
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {t === "all" ? "All Jobs" : t}
            </button>
          ))}

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition font-medium ml-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{totalFiltered}</span> {totalFiltered === 1 ? "posting" : "postings"}
        </div>
      </div>
    </div>
  );
}
