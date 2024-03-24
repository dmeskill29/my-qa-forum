"use client";
import React from "react";
import { useRouter } from "next/navigation";

const DeleteSolutionButton = ({ solutionId }) => {
  const router = useRouter();
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/solution", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ solutionId }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      if (response.ok) {
        const data = await response.json();
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete the solution:", error);
    }
  };

  return (
    <div className="text-right mt-4">
      <button
        onClick={handleSubmit}
        className="bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
      >
        Delete
      </button>
    </div>
  );
};

export default DeleteSolutionButton;
