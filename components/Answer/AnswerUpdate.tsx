"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const QuestionUpdate = ({ answerId }) => {
  const [text, setText] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Post data to the server
    try {
      const response = await fetch("/api/answerUpdate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: text, answerId }),
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <label
        htmlFor="content"
        className="block text-sm font-medium text-gray-700"
      >
        Content:
      </label>
      <textarea
        id="content"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="shadow-sm focus:ring-indigo-500 text-black focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
      />
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Update Answer
      </button>
    </form>
  );
};

export default QuestionUpdate;
