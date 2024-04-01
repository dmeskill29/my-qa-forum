"use client";
import React from "react";
import { useRouter } from "next/navigation";

const DeletereplyIdButton = ({ replyId }) => {
  const router = useRouter();
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/reply", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ replyId }),
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
    <div className="text-right mb-1">
      <button
        onClick={handleSubmit}
        className="bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 text-white font-bold py-1 px-2 rounded-full transition duration-150 ease-in-out"
      >
        Delete
      </button>
    </div>
  );
};

export default DeletereplyIdButton;
