"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Loader2,
  ArrowLeft,
  Sparkles,
  Eye,
  Edit,
} from "lucide-react";
import { Job, JobType, CreateJobInput, UpdateJobInput } from "@/types/job";
import { createJob, updateJob } from "@/lib/api/jobs";
import { useToast } from "./Toast";

interface JobFormProps {
  mode: "create" | "edit";
  initialJob?: Job;
  onSuccess?: (job: Job) => void;
}

export function JobForm({ mode, initialJob, onSuccess }: JobFormProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<CreateJobInput>({
    title: initialJob?.title || "",
    company: initialJob?.company || "",
    location: initialJob?.location || "",
    type: initialJob?.type || "full-time",
    salary: initialJob?.salary !== undefined ? initialJob.salary : undefined,
    description: initialJob?.description || "",
  });

  const [salaryString, setSalaryString] = useState<string>(
    initialJob?.salary !== undefined ? String(initialJob.salary) : ""
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  // Validate form inputs
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required.";
    } else if (formData.title.length < 3) {
      newErrors.title = "Job title must be at least 3 characters.";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required.";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Job location is required (e.g., 'Remote' or 'San Francisco, CA').";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Job description is required.";
    } else if (formData.description.length < 15) {
      newErrors.description = "Please provide a more detailed description (at least 15 characters).";
    }

    if (salaryString.trim() !== "") {
      const num = Number(salaryString);
      if (isNaN(num) || num < 0) {
        newErrors.salary = "Salary must be a valid positive number.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSalaryString(val);
    if (val.trim() === "") {
      setFormData((prev) => ({ ...prev, salary: undefined }));
    } else {
      const num = Number(val);
      if (!isNaN(num)) {
        setFormData((prev) => ({ ...prev, salary: num }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast("Please correct the errors in the form.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "create") {
        const payload: CreateJobInput = {
          title: formData.title.trim(),
          company: formData.company.trim(),
          location: formData.location.trim(),
          type: formData.type,
          salary: formData.salary,
          description: formData.description.trim(),
        };

        const created = await createJob(payload);
        showToast("Job posting created successfully!", "success");
        if (onSuccess) {
          onSuccess(created);
        } else {
          router.push(`/jobs/${created.id}`);
        }
      } else if (mode === "edit" && initialJob) {
        const payload: UpdateJobInput = {
          title: formData.title.trim(),
          company: formData.company.trim(),
          location: formData.location.trim(),
          type: formData.type,
          salary: formData.salary,
          description: formData.description.trim(),
        };

        const updated = await updateJob(initialJob.id, payload);
        showToast("Job posting updated successfully!", "success");
        if (onSuccess) {
          onSuccess(updated);
        } else {
          router.push(`/jobs/${updated.id}`);
        }
      }
    } catch (err: unknown) {
      console.error("Form submit error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save job posting.";
      showToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const jobTypes: { value: JobType; label: string; desc: string }[] = [
    {
      value: "full-time",
      label: "Full-Time",
      desc: "Standard 40h/week dedicated role",
    },
    {
      value: "part-time",
      label: "Part-Time",
      desc: "Flexible or reduced weekly hours",
    },
    {
      value: "contract",
      label: "Contract",
      desc: "Fixed-term or project-based agreement",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href={mode === "edit" && initialJob ? `/jobs/${initialJob.id}` : "/jobs"}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{mode === "edit" ? "Back to Job Details" : "Back to Jobs List"}</span>
        </Link>

        {/* Tab switcher for mobile / preview */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === "edit"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === "preview"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        {/* Banner header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                {mode === "create" ? "Post a New Job Opening" : `Edit Job Posting #${initialJob?.id}`}
              </h1>
              <p className="text-xs sm:text-sm text-indigo-200/80 mt-0.5">
                {mode === "create"
                  ? "Publish your vacancy to connect with top-tier engineering talent."
                  : "Modify the posting details. Changes update immediately on NestJS backend."}
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8">
          {activeTab === "preview" ? (
            /* Live Preview Mode */
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs text-indigo-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  This is how your job posting will appear to candidates on the board.
                </span>
              </div>

              {/* Preview Card */}
              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {formData.company || "Company Name"}
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 mt-1">
                      {formData.title || "Untitled Job Opening"}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {formData.location || "Location not specified"}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
                        {formData.salary ? `$${formData.salary.toLocaleString()} / yr` : "Competitive"}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200 capitalize">
                        {formData.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200 text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {formData.description || "No description provided yet."}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab("edit")}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition"
                >
                  Return to Edit Form
                </button>
              </div>
            </div>
          ) : (
            /* Form Mode */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Title & Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Job Title <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Senior Full Stack Engineer"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 transition ${
                        errors.title
                          ? "border-rose-400 bg-rose-50/30 focus:ring-rose-200"
                          : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-indigo-500/20 focus:border-indigo-500"
                      }`}
                    />
                  </div>
                  {errors.title && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Company Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Acme Technologies"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 transition ${
                        errors.company
                          ? "border-rose-400 bg-rose-50/30 focus:ring-rose-200"
                          : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-indigo-500/20 focus:border-indigo-500"
                      }`}
                    />
                  </div>
                  {errors.company && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{errors.company}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Location & Salary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Location <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Remote, San Francisco, CA, or Hybrid"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 transition ${
                        errors.location
                          ? "border-rose-400 bg-rose-50/30 focus:ring-rose-200"
                          : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-indigo-500/20 focus:border-indigo-500"
                      }`}
                    />
                  </div>
                  {errors.location && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{errors.location}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Annual Salary (USD)
                    </label>
                    <span className="text-[11px] text-slate-400">Optional</span>
                  </div>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      placeholder="e.g. 135000"
                      value={salaryString}
                      onChange={handleSalaryChange}
                      min="0"
                      step="1000"
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 transition ${
                        errors.salary
                          ? "border-rose-400 bg-rose-50/30 focus:ring-rose-200"
                          : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-indigo-500/20 focus:border-indigo-500"
                      }`}
                    />
                  </div>
                  {errors.salary ? (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{errors.salary}</p>
                  ) : formData.salary ? (
                    <p className="mt-1 text-xs text-indigo-600 font-medium">
                      Formatted: ${formData.salary.toLocaleString()} / year
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Row 3: Job Type (Interactive Cards) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Employment Type <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {jobTypes.map((typeOption) => {
                    const isSelected = formData.type === typeOption.value;
                    return (
                      <button
                        type="button"
                        key={typeOption.value}
                        onClick={() =>
                          setFormData({ ...formData, type: typeOption.value })
                        }
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? "bg-indigo-50/70 border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs"
                            : "bg-slate-50/40 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm font-bold ${
                              isSelected ? "text-indigo-950" : "text-slate-800"
                            }`}
                          >
                            {typeOption.label}
                          </span>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? "border-indigo-600 bg-indigo-600 text-white"
                                : "border-slate-300"
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {typeOption.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 4: Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Detailed Job Description <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {formData.description.length} characters
                  </span>
                </div>
                <textarea
                  rows={6}
                  placeholder="Describe the role responsibilities, key qualifications, team mission, and benefits..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={`w-full p-4 text-sm rounded-2xl border focus:outline-none focus:ring-2 transition leading-relaxed ${
                    errors.description
                      ? "border-rose-400 bg-rose-50/30 focus:ring-rose-200"
                      : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-indigo-500/20 focus:border-indigo-500"
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">{errors.description}</p>
                )}
              </div>

              {/* Submit / Cancel Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Link
                  href={mode === "edit" && initialJob ? `/jobs/${initialJob.id}` : "/jobs"}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-600/25 transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>
                    {isSubmitting
                      ? mode === "create"
                        ? "Publishing..."
                        : "Saving Changes..."
                      : mode === "create"
                      ? "Publish Job Opening"
                      : "Save Changes"}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
