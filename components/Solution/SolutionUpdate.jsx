"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const QuestionUpdate = ({ solutionId }) => {
  const [text, setText] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Post data to the server
    try {
      const response = await fetch("/api/solutionUpdate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: text, solutionId }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      if (response.ok) {
        // Handle success - e.g., redirecting to a new page or showing a success message
        const data = await response.json();
        setText("");
        router.refresh();
      }

      // Handle success - e.g., redirecting to a new page or showing a success message
    } catch (error) {
      console.error("Failed to submit the problem:", error);
      // Handle error - e.g., displaying an error message
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto my-8 p-6 bg-white rounded-lg shadow-md space-y-6"
    >
      <div>
        <label
          htmlFor="content"
          className="block text-lg font-semibold text-gray-700 mb-2"
        ></label>
        <textarea
          id="content"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="4"
          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-sm border border-gray-300 rounded-lg p-3"
          placeholder="Type your solution here..."
        ></textarea>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="flex items-center justify-center px-2 py-1 border border-transparent text-sm font-semibold rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        >
          Update Solution
        </button>
      </div>
    </form>
  );
};

export default QuestionUpdate;
