import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";
import SearchBar from "./SearchBar";
import ProfileMenu from "./ProfileMenu";

const NavBar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="container mx-auto flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="flex items-center text-blue-500 hover:text-blue-600 transition duration-150 ease-in-out"
      >
        <img src="/SolveSuiteLogo.png" alt="SolveSuite" className="h-16" />
      </Link>

      {/* Search Bar centered */}
      <div className="flex-1 mx-4">
        <SearchBar />
      </div>

      {/* Profile Button or Sign In Link on the right */}
      <div>
        {session?.user ? (
          <ProfileMenu session={session} />
        ) : (
          <Link
            href="/sign-in"
            className="text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded px-4 py-2 transition duration-150 ease-in-out"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavBar;
