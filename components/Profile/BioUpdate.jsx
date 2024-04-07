"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Corrected import path

const BioUpdate = ({ session }) => {
  const [bio, setBio] = useState(session?.user?.bio || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const MAX_BIO_LENGTH = 160; // Define a maximum bio length, for example, 160 characters

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      bio: bio,
    };

    if (bio.length > MAX_BIO_LENGTH) {
      alert(`Bio must be less than ${MAX_BIO_LENGTH} characters.`);
      return;
    }

    try {
      const response = await fetch("/api/bioUpdate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setBio("");
        setIsModalOpen(false);
        router.refresh();
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Failed to update the bio:", error);
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="middle none center rounded-full bg-gray-800 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-800/20 transition-all hover:shadow-lg hover:shadow-gray-800/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      >
        Update
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
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
