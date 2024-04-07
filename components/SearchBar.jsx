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
    router.push(`/search-results?query=${encodeURIComponent(query)}&type=all`);
    setQuery("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center w-full sm:max-w-xl mx-auto mt-3 mb-2"
    >
      <div className="flex-grow relative">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className=" py-2 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border border-gray-300 rounded-l-3xl transition duration-150 ease-in-out text-black w-1/2"
        />
        <button
          type="submit"
          className="absolute  text-white py-2 px-4 rounded-r-3xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out"
          style={{ backgroundColor: "#307e79", borderColor: "#307e79" }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#2b6d6b")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#307e79")
          }
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
