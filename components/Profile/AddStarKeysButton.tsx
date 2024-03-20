"use client";

import React from "react";
import { useState } from "react";
import Image from "next/image";

const AddStarKeysButton = () => {
  const [prizeInStarKeys, setPrizeInStarKeys] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Post data to the server
    try {
      const response = await fetch("/api/addStarKeys", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ starKeysAdded: 1 }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Handle success - e.g., redirecting to a new page or showing a success message
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Failed to submit the star keys:", error);
      // Handle error - e.g., displaying an error message
    }
  };

  return (
    <form>
      <div>
        <label
          htmlFor="prizeInStarKeys"
          className="block text-sm font-medium text-gray-700"
        ></label>
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
        onClick={handleSubmit}
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Add <Image src="/starkey.png" alt="Star Key" className="h-4" />
      </button>
    </form>
  );
};

export default AddStarKeysButton;
