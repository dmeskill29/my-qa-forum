"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const CreateSolution = ({ problemId }) => {
  const [text, setText] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Trim text to ensure it's not just whitespace
    const trimmedText = text.trim();

    // Check if content is provided
    if (!trimmedText) {
      alert("Content is required.");
      return;
    }

    // Post data to the server
    try {
      const response = await fetch("/api/solution", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: trimmedText,
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
        />
      </div>
      <button
        type="submit"
        className="inline-flex justify-center px-2 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
      >
        Create Solution
      </button>
    </form>
  );
};

export default CreateSolution;
