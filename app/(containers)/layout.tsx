// app/(containers)/layout.tsx
"use client";

import { Suspense } from "react";
import Navbar from "../component/navBar/NavBar";
import Sidebar from "../component/sideBar/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-10 bg-gray-50 overflow-auto">
          <Suspense
            fallback={
              <div className="text-center p-4 min-h-screen bg-gray-100">
                Loading...
              </div>
            }
          >
          {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
