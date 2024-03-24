"use client";
import { signIn } from "next-auth/react";
import React from "react";

const UserAuthForm = () => {
  const handleLogin = async () => {
    // This will display NextAuth's default sign-in page with all configured providers
    await signIn();
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <button
        onClick={handleLogin}
        className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
      >
        Sign In
      </button>
    </div>
  );
};

export default UserAuthForm;
