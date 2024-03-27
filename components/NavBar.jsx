import Link from "next/link";
import React from "react";
import SearchBar from "./SearchBar";
import ProfileMenu from "./Profile/ProfileMenu";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Image from "next/image";

const NavBar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto flex items-center justify-between py-2 px-4 sm:px-6 lg:px-8">
        <Link
          href="/Feed"
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

        <div className="flex-1 mx-4">
          <SearchBar session={session} />
        </div>

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
    </nav>
  );
};

export default NavBar;
