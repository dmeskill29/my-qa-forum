"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CreateReply = ({ solutionId, replyId }) => {
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // POST the reply
    const response = await fetch("/api/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ solutionId, content, parentReplyId: replyId }),
    });
    if (response.ok) {
      // Handle success, such as clearing the form, refetching replies, etc.
      setContent("");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto my-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a reply..."
        className="w-full h-32 p-4 text-sm text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
      />
      <button
        type="submit"
        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Reply
      </button>
    </form>
  );
};

export default CreateReply;
