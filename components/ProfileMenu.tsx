"use client";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";
import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";

const ProfileMenu = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);
  const image = session.user.image;

  return (
    <div className="mr-8 absolute right-0">
      {/* Profile Icon/Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="block h-10 w-10 rounded-full overflow-hidden border-2 border-gray-600 focus:outline-none"
      >
        <img
          className="h-full w-full object-cover"
          src={image}
          alt="Your Profile"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
          <Link
            href={`/user/${session.user.username}`}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {session.user.username}
          </Link>
          <button
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            onClick={() => signOut()}
          >
            Sign Out
          </button>
        </div>
      )}
      {/* <img src={image} alt="Profile" className="h-16 w-16 rounded-full" /> */}
    </div>
  );
};

export default ProfileMenu;
