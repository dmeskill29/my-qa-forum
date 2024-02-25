"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const DownVoteButton = ({ questionId }) => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/questionVote", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId,
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

export default DownVoteButton;
