"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    router.push("/login"); // Redirect to login
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          isCollapsed ? "w-16" : "w-64"
        } bg-white text-blue-900 transition-all duration-300 p-4 flex flex-col justify-between`}
      >
        <div>
          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="bg-gray-200 hover:bg-gray-300 text-blue-900 p-2 rounded mb-4"
          >
            {isCollapsed ? ">" : "<"}
          </button>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-4">
            <Link href="/home" className="hover:text-blue-700 font-bold">
              {isCollapsed ? "🏠" : "Home"}
            </Link>
            <Link href="/product" className="hover:text-blue-700 font-bold">
              {isCollapsed ? "📦" : "Products"}
            </Link>
            <Link href="/persons" className="hover:text-blue-700 font-bold">
              {isCollapsed ? "👤" : "Persons"}
            </Link>
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full  text-blue-800 p-2 rounded flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          {!isCollapsed && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default SideBar;
