"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const CreateQuestion = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [prize, setPrize] = useState(0);
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Post data to the server
    try {
      const response = await fetch("/api/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, authorId: userId, prize }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      if (response.ok) {
        // Handle success - e.g., redirecting to a new page or showing a success message
        const data = await response.json();
        router.push(`/${data.result.id}`);
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
        <p>Please sign in to ask a question</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title:</label>
      <input
        id="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label htmlFor="content">Content:</label>
      <textarea
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <label htmlFor="prize">Prize:</label>
      <input
        id="prize"
        type="number"
        value={prize}
        onChange={(e) => setPrize(Number(e.target.value))}
      />

      <button type="submit">Create Question</button>
    </form>
  );
};

export default CreateQuestion;
