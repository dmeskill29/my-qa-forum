"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
const CreateAnswer = ({ questionId }) => {
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
      const response = await fetch("/api/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: trimmedText,
          authorId: session?.user?.id,
          questionId,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Handle success - e.g., redirecting to a new page or showing a success message
      const data = await response.json();
      router.reload(); // Use router.reload() for refreshing the page
    } catch (error) {
      console.error("Failed to submit the answer:", error);
      // Handle error - e.g., displaying an error message
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div>
        <p>Please sign in to answer the question</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6 space-y-6"
    >
      <div>
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
          rows="4"
          className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md placeholder-gray-400"
          placeholder="Share your thoughts..."
          required
        />
      </div>
      <button
        type="submit"
        className="inline-flex justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
      >
        Create Answer
      </button>
    </form>
  );
};

export default CreateAnswer;
