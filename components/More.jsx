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
        aria-expanded={isOpen} // Accessibility improvement
        className="block h-10 w-10  overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        More
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "50px", // Adjust this value to move the menu up or down
            right: "0",
            zIndex: 20,
            width: "200px", // Adjust the width as needed
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
        </div>
      )}
    </div>
  );
};

export default More;
