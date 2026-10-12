"use client";

import { useRouter } from "next/navigation";
import PersonDetails from "../PersonDetails";

export default function PersonDetailsPage() {
  const router = useRouter();

  return (
    <div className="">
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ← Back
      </button>
      <div className="p-6 max-w-xl mx-auto">
        <PersonDetails />
      </div>
    </div>
  );
}
