"use client";

import React from "react";

const SpinnerLoader = () => {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="w-6 h-6 border-4 border-t-transparent border-blue-600 border-solid rounded-full animate-spin"></div>
      <p className="text-blue-600 font-semibold">Loading...</p>
    </div>
  );
};

export default SpinnerLoader;
