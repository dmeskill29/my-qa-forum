"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search-results?query=${encodeURIComponent(query)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center max-w-lg mx-auto mt-3 mb-2"
    >
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow py-2 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border border-gray-300 rounded-l-md transition duration-150 ease-in-out"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
