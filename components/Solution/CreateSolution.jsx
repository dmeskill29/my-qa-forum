"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const CreateSolution = ({ problemId }) => {
  const [text, setText] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  const MAX_SOLUTION_LENGTH = 1000;

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Trim text to ensure it's not just whitespace
    const trimmedText = text.trim();

    // Check if content is provided
    if (!trimmedText) {
      alert("Content is required.");
      return;
    }

    if (trimmedText.length > MAX_SOLUTION_LENGTH) {
      alert(`Solution must be less than ${MAX_SOLUTION_LENGTH} characters.`);
      return;
    }

    const contentWithBreaks = trimmedText.replace(/\n/g, "<br />");
    // Post data to the server
    try {
      const response = await fetch("/api/solution", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: contentWithBreaks,
          problemId,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Handle success - e.g., redirecting to a new page or showing a success message
      const data = await response.json();
      setText("");
      router.refresh(); // Use router.reload() for refreshing the page
    } catch (error) {
      console.error("Failed to submit the solution:", error);
      // Handle error - e.g., displaying an error message
      alert("Failed to submit the solution. Please try again.");
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div>
        <p>Please sign in to solution the problem</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-4 space-y-6"
    >
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        ></label>
        <textarea
          id="content"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="4"
          className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md placeholder-gray-400 text-black"
          placeholder="Share your thoughts..."
          required
          style={{ whiteSpace: "pre-wrap" }}
        />
      </div>
      <button
        type="submit"
        className="middle none center rounded-full bg-gray-800 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-800/20 transition-all hover:shadow-lg hover:shadow-gray-800/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      >
        Create Solution
      </button>
    </form>
  );
};

export default CreateSolution;
