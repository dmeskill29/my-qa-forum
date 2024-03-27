"use client";

import React from "react";
import { useRouter } from "next/navigation";

const SolutionDownVoteButton = ({ solutionId }) => {
  const router = useRouter();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/solutionVote", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          solutionId,
          type: "DOWN",
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      if (response.ok) {
        const data = await response.json();
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to submit the question:", error);
    }
  };
  return (
    <div className="flex items-center">
      <button
        onClick={handleSubmit}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ease-in-out"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>
    </div>
  );
};

export default SolutionDownVoteButton;
