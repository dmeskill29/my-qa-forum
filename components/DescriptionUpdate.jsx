"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Corrected import path

const DescriptionUpdate = ({ circle }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState(circle.description);
  const router = useRouter();

  const maxLength = 160; // Define a maximum description length, for example, 160 characters

  const editDescription = async () => {
    try {
      if (description.length > maxLength) {
        alert(`Description must be less than ${maxLength} characters.`);
        return;
      }
      const response = await fetch(`/api/circle`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description, circleId: circle.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to update circle description");
      }

      // Close the modal and update the local state if needed
      setIsModalOpen(false);
      router.refresh();
      // You might want to update the circle state in the parent component here
    } catch (error) {
      console.error("Error updating circle description:", error);
      alert("Failed to update circle description. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={() => setIsModalOpen(true)}
      >
        Update
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-5 border w-96 shadow-lg rounded-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Update Circle Description
            </h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              rows="4"
              maxLength={maxLength}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mr-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={editDescription}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DescriptionUpdate;
