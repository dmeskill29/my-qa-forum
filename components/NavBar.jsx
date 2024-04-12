import Link from "next/link";
import React from "react";
import SearchBar from "./SearchBar";
import ProfileMenu from "./Profile/ProfileMenu";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import More from "./More";

const NavBar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <nav className="bg-gray-800 text-white sticky top-0 z-50">
      <div
        className="container justify-between flex items-center space-x-4 sm:space-x-6 md:space-x-10
       lg:space-x-32 py-2 px-4 sm:px-6 lg:px-20"
      >
        <div className="flex items-center space-x-2 lg:space-x-10">
          <Link
            href="/"
            className="flex items-center justify-center hover:text-blue-500 transition duration-150 ease-in-out"
          >
            <Image
              src="/SolveSuiteLogo.png"
              alt="SolveSuite"
              width={50}
              height={50}
            />
            <span className="hidden md:inline text-2xl font-bold text-white ml-2 hover:text-blue-500 transition duration-150 ease-in-out">
              SolveCircle
            </span>
          </Link>

          {session && <More />}
        </div>

        <div className="flex-1">
          <SearchBar session={session} />
        </div>

        {session && (
          <div className="flex items-center space-x-4">
            <Link
              href="/CreateProblem"
              className="inline-flex items-center px-2 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-white hover:bg-gray-200 transition duration-150 ease-in-out"
            >
              <svg className="w-5 h-5 " viewBox="0 0 20 20" fill="black">
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        )}

        <div className="flex items-center space-x-4 lg:absolute right-20">
          {session ? (
            <ProfileMenu session={session} />
          ) : (
            <Link
              href="/sign-in"
              className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md transition duration-150 ease-in-out"
            >
              Sign In/Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
