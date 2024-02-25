"use client";
import React from "react";
import { useRouter } from "next/navigation";

const PinTopAnswerButton = ({ answerId, questionId }) => {
  const router = useRouter();
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Post data to the server
    try {
      const response = await fetch("/api/pinTopAnswer", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questionId, answerId }),
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

  return (
    <div>
      <button onClick={handleSubmit}>Pin to top</button>
    </div>
  );
};

export default PinTopAnswerButton;
