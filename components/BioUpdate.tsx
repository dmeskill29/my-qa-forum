"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Corrected import path

const BioUpdate = ({ session }) => {
  const [bio, setBio] = useState(session?.user?.bio || ""); // If you have bio stored in session, load it
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Construct the payload, including user ID or other user identifier if needed
    const payload = {
      username: session.user.username,
      bio: bio,
    };

    // Post data to the server
    try {
      const response = await fetch("/api/bioUpdate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Handle success
        const data = await response.json();
        setBio(""); // Clear the form (if needed)
        // Update local state/session as needed
        router.refresh(); // Consider using router.push for navigation instead of reload
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Failed to update the bio:", error);
      // Handle error
    }
  };

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700"
          >
            New Bio:
          </label>
          <textarea
            id="bio"
            name="bio"
            required
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="mt-1 block w-full px-3 py-2 bg-white shadow-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Tell us about yourself..."
          />
        </div>
        <button
          type="submit"
          className="flex justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          Update Bio
        </button>
      </form>
    </div>
  );
};

export default BioUpdate;
