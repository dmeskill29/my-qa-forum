"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

const More = () => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    // Listen for mousedown or touchstart events for broader device compatibility
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex items-center" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="relative flex items-center justify-center px-2 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <div className="flex flex-col space-y-1">
          <span
            className={`w-6 h-0.5 bg-gray-700 rounded-sm transition duration-300 ease-in-out ${
              isOpen ? "transform rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-gray-700 rounded-sm transition duration-300 ease-in-out ${
              isOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-gray-700 rounded-sm transition duration-300 ease-in-out ${
              isOpen ? "-transform rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </div>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "50px", // Adjust this value to move the menu up or down
            right: "0",
            zIndex: 20,
            width: "130px", // Adjust the width as needed
            backgroundColor: "white",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}
        >
          {" "}
          {/* Navigation Links */}
          <Link
            href="/"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Home
          </Link>
          <Link
            href="/About"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            About
          </Link>
          <Link
            href="/Navigate"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Navigate
          </Link>
          <Link
            href="/Leaderboard"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Leaderboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default More;
