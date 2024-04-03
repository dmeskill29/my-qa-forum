"use client";
import React from "react";
import { useRouter } from "next/navigation";

const PinTopSolutionButton = ({ solutionId, problemId }) => {
  const router = useRouter();
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Post data to the server
    try {
      const response = await fetch("/api/pinTopSolution", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ problemId, solutionId }),
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
        className="middle none center rounded-full bg-gray-800 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-800/20 transition-all hover:shadow-lg hover:shadow-gray-800/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      >
        Pin
      </button>
    </div>
  );
};

export default PinTopSolutionButton;
