import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";
import SearchBar from "./SearchBar";
import ProfileMenu from "./ProfileMenu";

const NavBar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="container mx-auto flex justify-between items-center py-4">
      <Link href="/" className="text-blue-500 absolute left-0 ml-4">
        <img src="/SolveSuiteLogo.png" alt="SolveSuite" className="h-12" />
      </Link>
      {session?.user ? (
        <div className="flex items-center justify-between max-w-md mx-auto space-x-4">
          <SearchBar />
          <ProfileMenu session={session} />
        </div>
      ) : (
        <div className="flex items-center justify-between max-w-md mx-auto space-x-4">
          <SearchBar />
          <Link href="/sign-in" className="text-red-500 mr-8 absolute right-4">
            Sign In
          </Link>
        </div>
      )}
    </div>
  );
};

export default NavBar;
