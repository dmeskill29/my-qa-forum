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
          className="middle none center rounded-full bg-gray-800 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-800/20 transition-all hover:shadow-lg hover:shadow-gray-800/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        >
          Update Solution
        </button>
      </div>
    </form>
  );
};

export default QuestionUpdate;
