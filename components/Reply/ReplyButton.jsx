"use client";
import React, { useState } from "react";
import CreateReply from "./CreateReply";

const ReplyButton = ({ solutionId, replyId }) => {
  // State to control the visibility of the reply form
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className="relative mt-4">
      <button
        className="bg-blue-500 text-white font-medium text-sm px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
        onClick={() => setShowReplyForm(!showReplyForm)}
      >
        Reply
      </button>
      {showReplyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-center items-center">
          <div className="bg-white shadow-lg rounded-md p-4 border border-gray-200 w-full max-w-lg mx-4 relative">
            <CreateReply solutionId={solutionId} replyId={replyId} />
            <button
              type="button"
              className="mt-4 py-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-150 ease-in-out"
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
