"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Corrected import path

const BioUpdate = ({ session }) => {
  const [bio, setBio] = useState(session?.user?.bio || ""); // If you have bio stored in session, load it
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
        setIsModalOpen(false); // Close the modal (if needed)
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
    <>
      <button
        onClick={openModal}
        className="mb-4 px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition duration-150 ease-in-out"
      >
        Update
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                {/* Modal content here */}
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  Update Bio
                </h3>
                <button
                  onClick={closeModal}
                  className="absolute top-0 right-0 p-4"
                >
                  <span className="text-gray-400 hover:text-gray-500">
                    &times;
                  </span>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="mt-2">
                <textarea
                  className="w-full rounded"
                  rows="4"
                  onChange={(e) => setBio(e.target.value)}
                  value={bio}
                  placeholder="Enter your new bio here"
                ></textarea>
                <div className="items-center px-4 py-3">
                  <button
                    id="ok-btn"
                    className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    Update Bio
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BioUpdate;
