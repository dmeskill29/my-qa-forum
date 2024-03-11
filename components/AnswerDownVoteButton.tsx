"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const AnswerDownVoteButton = ({ answerId }) => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/answerVote", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answerId,
          type: "DOWN",
          userId,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      if (response.ok) {
        const data = await response.json();
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to submit the question:", error);
    }
  };
  return (
    <div className="flex items-center">
      <button
        onClick={handleSubmit}
        className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700"
      >
        DownVote
      </button>
    </div>
  );
};

export default AnswerDownVoteButton;
