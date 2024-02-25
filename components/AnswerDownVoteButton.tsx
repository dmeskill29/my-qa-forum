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
    <div>
      <button onClick={handleSubmit}>DownVote</button>
    </div>
  );
};

export default AnswerDownVoteButton;
