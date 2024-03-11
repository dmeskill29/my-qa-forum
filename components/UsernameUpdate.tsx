"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const UsernameUpdate = ({ session }) => {
  const [text, setText] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Post data to the server
    try {
      const response = await fetch("/api/usernameUpdate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernameNew: text,
          usernameOld: session.user.username,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      if (response.ok) {
        // Handle success - e.g., redirecting to a new page or showing a success message
        const data = await response.json();
        router.push(`/user/${data.result.username}`);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to submit the question:", error);
      // Handle error - e.g., displaying an error message
    }
  };

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="newUsername"
            className="block text-sm font-medium text-gray-700"
          >
            New Username:
          </label>
          <input
            id="newUsername"
            name="newUsername"
            type="text"
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white shadow-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="flex justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          Update Username
        </button>
      </form>
    </div>
  );
};

export default UsernameUpdate;
