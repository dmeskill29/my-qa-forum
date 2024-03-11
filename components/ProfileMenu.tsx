"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import React, { useState, useEffect, useRef } from "react";

const ProfileMenu = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const image = session.user.image;

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className="relative flex items-center" ref={wrapperRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="block h-10 w-10 rounded-full overflow-hidden border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <img
          className="h-full w-full object-cover"
          src={image}
          alt="Your Profile"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-36 py-1 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200 transition-opacity duration-200 ease-linear">
          {/* User Profile Link */}
          <Link
            href={`/user/${session.user.username}`}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out"
          >
            {session.user.username}
          </Link>

          {/* Sign Out Button */}
          <button
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition duration-150 ease-in-out"
            onClick={() => signOut()}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
