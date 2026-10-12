// app/login/Login.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { login } from "@/app/services/users";

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      email: email,
      password: password,
    };

    try {
      const data = await login(payload);
      console.log("Login response:", data);
      router.push("/home");
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full"
    >
      <h1 className="text-3xl font-bold text-center mb-6 text-[rgb(44,56,92)]">
        Welcome Back 👋
      </h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="********"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[rgb(44,56,92)] hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Login
        </button>
      </form>

      <p className="text-center text-sm mt-6">
        Don’t have an account?{" "}
        <Link
          href="/register"
          className="text-[rgb(44,56,92)] font-medium hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </motion.div>
  );
};

export default Login;
