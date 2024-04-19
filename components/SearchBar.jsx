"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const SearchBar = ({ session }) => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if user is not logged in
    if (!session) {
      // Optionally, display a message or handle the logic to show login prompt
      alert("Please log in to use the search feature.");
      return;
    }
    router.push(
      `/search-results?query=${encodeURIComponent(query)}&type=problems`
    );
    setQuery("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-center w-full mx-auto mt-3 mb-2"
    >
      <div className="relative w-3/4">
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(e);
            }
          }}
          className="py-2 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent border border-gray-300 rounded-full w-full text-gray-700 placeholder-gray-400 shadow-sm transition duration-150 ease-in-out"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="w-5 h-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
