"use client";

import React from "react";
import { useRouter } from "next/navigation";

const CloseProblemButton = ({ problemId }) => {
  const router = useRouter();
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Post data to the server
    try {
      const response = await fetch("/api/closeProblem", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ problemId }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      if (response.ok) {
        // Handle success - e.g., redirecting to a new page or showing a success message
        const data = await response.json();
        router.refresh();
      }

      // Handle success - e.g., redirecting to a new page or showing a success message
    } catch (error) {
      console.error("Failed to submit the problem:", error);
      // Handle error - e.g., displaying an error message
    }
  };

  return (
    <div className="inline-block">
      <button
        onClick={handleSubmit}
        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Close Problem
      </button>
    </div>
  );
};

export default CloseProblemButton;
