// app/page.tsx
"use client";

import React, { useEffect } from "react";
import Link from "next/link";

const HomePage = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const [, payload] = token.split(".");
      const decodedPayload = JSON.parse(atob(payload));
      console.log("Expiration time (exp):", decodedPayload.exp);
      const expirationDate = new Date(decodedPayload.exp * 1000);
      console.log("Token expires at:", expirationDate.toLocaleString());
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
        Welcome to Next.js Full Stack Learning Project
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Feature Card */}
        <FeatureCard
          title="User Authentication"
          description="Login securely with your credentials and protect your routes with auth."
          href="/login"
          btnLabel="Login"
        />
        <FeatureCard
          title="Product Cart"
          description="Browse products, add them to your cart, and manage quantities before checkout."
          href="/product"
          btnLabel="View Cart"
        />
        <FeatureCard
          title="Manage Persons"
          description="Create, read, update, and delete person details in a seamless interface."
          href="/persons"
          btnLabel="Manage"
        />
        <FeatureCard
          title="Profile & Settings"
          description="Update your personal profile and application preferences."
          href="/profile"
          btnLabel="Go to Profile"
        />
      </div>
    </div>
  );
};

const FeatureCard = ({
  title,
  description,
  href,
  btnLabel,
}: {
  title: string;
  description: string;
  href: string;
  btnLabel: string;
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link
        href={href}
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {btnLabel}
      </Link>
    </div>
  );
};

export default HomePage;
