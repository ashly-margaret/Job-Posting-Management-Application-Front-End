"use client";

import React from "react";
import { Navbar } from "@/components/jobs/Navbar";
import { JobForm } from "@/components/jobs/JobForm";

export default function NewJobPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <JobForm mode="create" />
      </main>
    </div>
  );
}
