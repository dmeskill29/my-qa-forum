"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setErrorMessage("Email and password are required");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      return;
    }

    try {
      const response = await fetch("/api/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      router.push("/sign-in");

      // Implement redirection or state update on successful signup
    } catch (error) {
      setErrorMessage(error.message || "An error occurred during signup");
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 w-full sm:max-w-md">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden mt-8 md:mt-12 lg:mt-16 p-6">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-4">
          Sign Up
        </h1>
        <p className="text-sm text-center text-gray-600 mb-6">
          By continuing, you agree to our
          <Link
            href="/user-agreement"
            className="text-blue-600 hover:underline mx-1"
          >
            User Agreement
          </Link>
          and
          <Link
            href="/privacy-policy"
            className="text-blue-600 hover:underline mx-1"
          >
            Privacy Policy.
          </Link>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              required
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="current-password"
              required
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-center text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign Up
          </button>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
