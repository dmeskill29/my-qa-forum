"use client";
import React, { use } from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const CreateAnswer = ({ questionId }) => {
  const [text, setText] = useState("");
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Post data to the server
    try {
      const response = await fetch("/api/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: text, authorId: userId, questionId }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      if (response.ok) {
        // Handle success - e.g., redirecting to a new page or showing a success message
        const data = await response.json();
        router.refresh();
      }

      // Handle success - e.g., redirecting to a new page or showing a success message
    } catch (error) {
      console.error("Failed to submit the question:", error);
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
    <form onSubmit={handleSubmit}>
      <label htmlFor="content">Content:</label>
      <textarea
        id="content"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Create Answer</button>
    </form>
  );
};

export default CreateAnswer;
