import React, { useState } from "react";
import client from "../api";
import { useNavigate, Link } from "react-router-dom";
import { Star } from "lucide-react";

export default function Signup({ onSignup }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await client.post("/auth/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onSignup?.(res.data.user);
      nav("/");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Left Visual */}
      <div
        className="hidden md:flex flex-col justify-center items-center bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1000&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center px-10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Discover, review, and share your favorite books
          </h2>
          <div className="flex justify-center text-yellow-400 text-xl mb-2">
            <Star fill="currentColor" />
            <Star fill="currentColor" />
            <Star fill="currentColor" />
            <Star fill="currentColor" />
            <Star fill="currentColor" />
          </div>
          <p className="text-gray-200 italic">
            “A place where stories connect readers.”
          </p>
        </div>
      </div>

      {/* Right Panel (Form) */}
      <div className="flex items-center justify-center p-8">
        <form
          onSubmit={submit}
          className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">
            Create an account
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Join our vibrant community of readers and reviewers
          </p>

          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            className="w-full p-3 mb-4 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-gray-50 dark:bg-gray-900"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            className="w-full p-3 mb-4 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-gray-50 dark:bg-gray-900"
            placeholder="jane@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full p-3 mb-6 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-gray-50 dark:bg-gray-900"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition"
          >
            Sign Up
          </button>

          <p className="text-center text-sm mt-4 text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-600 dark:text-orange-400 hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
