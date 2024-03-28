"use client";

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useRouter } from "next/navigation"; // Correct import path for useRouter
import Image from "next/image";

const ProblemUpdate = ({ problemId }) => {
  const [text, setText] = useState("");
  const [prizeInCircleKeys, setPrizeInCircleKeys] = useState(0);
  const [prizeInStarKeys, setPrizeInStarKeys] = useState(0);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Ensure text length does not exceed the maxLength defined below
    const maxLength = 500; // Example limit, adjust as needed
    if (text.length > maxLength) {
      alert(`Update content must be within ${maxLength} characters.`);
      return;
    }

    if (prizeInCircleKeys < 0 || prizeInStarKeys < 0) {
      alert("Prizes cannot be negative");
      return;
    }

    // Post data to the server
    try {
      const response = await fetch("/api/problemUpdate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: text,
          problemId,
          circleKeysAdded: prizeInCircleKeys,
          starKeysAdded: prizeInStarKeys,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Handle success
      setText("");
      setShowModal(false); // Close modal on successful update
      router.refresh(); // Consider fetching updated data here to refresh the component's state instead of reloading the page
    } catch (error) {
      alert("Failed to submit the problem update. Please try again.");
      console.error("Failed to submit the problem update:", error);
    }
  };

  const [modalContainer, setModalContainer] = useState(null); // Initialize as null

  useEffect(() => {
    const div = document.createElement("div");
    document.body.appendChild(div); // Attach the div to the body
    setModalContainer(div);

    return () => {
      document.body.removeChild(div); // Clean up by removing the div from the body
    };
  }, []);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex justify-center px-2 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-4"
      >
        Update Problem
      </button>

      {modalContainer &&
        ReactDOM.createPortal(
          showModal ? (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
              <form
                onSubmit={handleSubmit}
                className="w-1/2 mx-auto bg-white rounded-xl shadow-md overflow-hidden space-y-6 p-8"
              >
                <div>
                  <textarea
                    id="content"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows="4"
                    maxLength={500} // Set maxLength here
                    className="mt-1 shadow-sm text-black focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="Type your update..."
                  />
                </div>

                <div className="flex">
                  <label
                    htmlFor="prizeInCircleKeys"
                    className="block text-sm font-medium text-gray-700 flex items-center"
                  >
                    Add{" "}
                    <Image
                      src="/CircleKey.png"
                      alt="Circle Key"
                      width={20}
                      height={20}
                      className="ml-2 mr-2"
                    />
                  </label>
                  <input
                    type="number"
                    id="prizeInCircleKeys"
                    value={prizeInCircleKeys}
                    onChange={(e) =>
                      setPrizeInCircleKeys(Number(e.target.value))
                    }
                    className="input-field"
                    min="0"
                  />
                </div>
                <div className="flex">
                  <label
                    htmlFor="prizeInStarKeys"
                    className="block text-sm font-medium text-gray-700 flex items-center"
                  >
                    Add{" "}
                    <Image
                      src="/StarKey.png"
                      alt="Star Key"
                      width={20}
                      height={20}
                      className="ml-2 mr-2"
                    />
                  </label>
                  <input
                    type="number"
                    id="prizeInStarKeys"
                    value={prizeInStarKeys}
                    onChange={(e) => setPrizeInStarKeys(Number(e.target.value))}
                    className="input-field"
                    min="0"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex justify-center mr-2 px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mt-3 inline-flex justify-center  px-4 py-2 border border-gray-300 text-sm font-medium rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
              </form>
            </div>
          ) : null,
          modalContainer
        )}
    </>
  );
};

export default ProblemUpdate;
