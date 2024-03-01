import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import SignOutButton from "./SignOutButton";
import Link from "next/link";
import React from "react";
import SearchBar from "./SearchBar";

const NavBar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="container mx-auto flex justify-between items-center">
      <Link href="/" className="mr-4 text-blue-500">
        <img src="/SolveSuiteLogo.png" alt="SolveSuite" className="h-16" />
      </Link>
      {session?.user ? (
        <div className="relative">
          <SearchBar />
          <Link
            href={`/user/${session.user.username}`}
            className="text-blue-500"
          >
            {session.user.username}
          </Link>
          <SignOutButton />
        </div>
      ) : (
        <div className="flex items-center">
          <SearchBar />
          <Link href="/sign-in" className="text-red-500">
            Sign In
          </Link>
        </div>
      )}
    </div>
  );
};

export default NavBar;
