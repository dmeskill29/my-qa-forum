"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ReplyButton = ({ solutionId, replyId, problemId }) => {
  // State to control the visibility of the reply form
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [content, setContent] = useState("");

  const MAX_REPLY_LENGTH = 1000;

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // POST the reply

    if (content.trim().length === 0) {
      alert("Content is required.");
      return;
    }

    if (content.length > MAX_REPLY_LENGTH) {
      alert(`Reply must be less than ${MAX_REPLY_LENGTH} characters.`);
      return;
    }
    const response = await fetch("/api/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        solutionId,
        content,
        parentReplyId: replyId,
        problemId,
      }),
    });
    if (response.ok) {
      // Handle success, such as clearing the form, refetching replies, etc.
      setContent("");

      setShowReplyForm(false);
      router.refresh();
    }
  };

  return (
    <div className="relative ">
      <button
        className="middle none center rounded-full bg-gray-800 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-800/20 transition-all hover:shadow-lg hover:shadow-gray-800/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        onClick={() => setShowReplyForm(!showReplyForm)}
      >
        Reply
      </button>
      {showReplyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-center items-center">
          <div className="bg-white shadow-lg rounded-md p-4 border border-gray-200 w-full max-w-lg mx-4 relative">
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
            <button
              type="button"
              className="mt-4 py-2 px-4 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition duration-150 ease-in-out"
              onClick={() => setShowReplyForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReplyButton;
