"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Correct import path for useRouter

const QuestionUpdate = ({ questionId }) => {
  const [text, setText] = useState("");
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Ensure text length does not exceed the maxLength defined below
    const maxLength = 500; // Example limit, adjust as needed
    if (text.length > maxLength) {
      alert(`Update content must be within ${maxLength} characters.`);
      return;
    }

    // Post data to the server
    try {
      const response = await fetch("/api/questionUpdate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: text, questionId }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Handle success
      setText("");
      setShowModal(false); // Close modal on successful update
      router.refresh(); // Consider fetching updated data here to refresh the component's state instead of reloading the page
    } catch (error) {
      console.error("Failed to submit the question update:", error);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex justify-center px-2 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-4"
      >
        Update Question
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="w-2/3 mx-auto bg-white rounded-xl shadow-md overflow-hidden space-y-6 p-8"
          >
            <div>
              <textarea
                id="content"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows="4"
                maxLength={500} // Set maxLength here
                className="mt-1 shadow-sm text-black focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                placeholder="Type your update..."
              />
            </div>
            <button
              type="submit"
              className="inline-flex justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="mt-3 inline-flex justify-center w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default QuestionUpdate;
