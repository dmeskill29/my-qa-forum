"use client";
import React, { useState } from "react";
import CreateReply from "./CreateReply";

const ReplyButton = ({ solutionId, replyId }) => {
  // State to control the visibility of the reply form
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className="relative mt-4">
      <button
        className="bg-blue-500 text-white font-medium text-sm px-2 py-1 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
        onClick={() => setShowReplyForm(!showReplyForm)}
      >
        Reply
      </button>
      {showReplyForm && (
        <div className="absolute top-full mt-2 left-0 right-0 z-10 bg-white shadow-lg rounded-md p-4 border border-gray-200">
          <CreateReply solutionId={solutionId} replyId={replyId} />
        </div>
      )}
    </div>
  );
};

export default ReplyButton;
