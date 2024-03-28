"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
const UsernameUpdate = ({ session }) => {
  const [text, setText] = useState("");
  const [showModal, setShowModal] = useState(false); // State to control the visibility of the modal
  const router = useRouter();
  const MIN_USERNAME_LENGTH = 3; // Define a minimum username length, for example, 5 characters

  const handleSubmit = async (event) => {
    event.preventDefault();

    const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;

    if (!usernameRegex.test(text)) {
      alert("Invalid username format");
      return; // Stop the form submission
    }

    // Check if username meets the minimum length requirement
    if (text.length < MIN_USERNAME_LENGTH) {
      alert(
        `Username must be at least ${MIN_USERNAME_LENGTH} characters long.`
      );
      return; // Stop the form submission
    }

    if (text.includes(" ")) {
      alert("Username cannot contain spaces.");
      return; // Stop the form submission
    }

    // Proceed with submitting the data to the server
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

      // Handle success
      const data = await response.json();
      setShowModal(false);
      router.push(`/user/${data.result.username}`);
      router.refresh();
      // Consider using router.reload() instead of router.refresh() as refresh might not be a function
    } catch (error) {
      console.error("Failed to submit the username update:", error);
      // Handle error
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="mb-4 px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition duration-150 ease-in-out"
      >
        Update
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
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
                  type="text"
                  required
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Update Username
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsernameUpdate;
