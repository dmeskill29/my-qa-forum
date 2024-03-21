"use client";
import React from "react";
import { useRouter } from "next/navigation";

const PinTopAnswerButton = ({ answerId, questionId }) => {
  const router = useRouter();
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Post data to the server
    try {
      const response = await fetch("/api/pinTopAnswer", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questionId, answerId }),
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
      console.error("Failed to submit the question:", error);
      // Handle error - e.g., displaying an error message
    }
  };

  return (
    <div className="inline-block">
      <button
        onClick={handleSubmit}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out"
      >
        Pin
      </button>
    </div>
  );
};

export default PinTopAnswerButton;
