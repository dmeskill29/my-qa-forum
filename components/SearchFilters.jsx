"use client";
import React from "react";
import Link from "next/link";

const SearchFilters = ({ query }) => {
  return (
    <div className="flex justify-center space-x-4 mb-4">
      {["problems", "users"].map((type) => (
        <Link
          key={type}
          href={`/search-results?query=${encodeURIComponent(
            query
          )}&type=${type}`}
          className="px-4 py-2 rounded-full text-center transition duration-150 ease-in-out"
          style={{ backgroundColor: "#307e79", color: "white" }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#2b6d6b")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#307e79")
          }
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Link>
      ))}
    </div>
  );
};

export default SearchFilters;
