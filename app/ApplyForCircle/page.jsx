"use client";
import React, { use, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Corrected the import path
import PleaseSignIn from "@/components/PleaseSignIn";

const ApplyForCircle = () => {
  const NAME_LIMIT = 100;
  const MESSAGE_LIMIT = 1000;

  const [message, setMessage] = useState("");
  const [circleName, setCircleName] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter(); // Corrected the import path

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      alert("You must be logged in to apply");
      return;
    }

    try {
      const response = await fetch("/api/applyForCircle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          circleName,
          message,
        }),
      });

      if (response.status === 200) {
        alert("Successfully applied for the circle!");
        router.push("/"); // Redirect to the home page
      } else {
        alert("Failed to apply for the circle.");
      }
    } catch (error) {
      console.error("Error applying for circle:", error);
      alert("An error occurred while trying to apply for the circle.");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center space-y-2">
          <svg
            className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-500 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-lg text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <PleaseSignIn />;
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Apply for New Circle
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Circle Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={circleName}
            onChange={(e) => setCircleName(e.target.value)}
            required
            maxLength={NAME_LIMIT}
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700"
          >
            Application Message
          </label>
          <textarea
            id="message"
            name="message"
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            maxLength={MESSAGE_LIMIT}
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default ApplyForCircle;
