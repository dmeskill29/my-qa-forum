import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import SignOutButton from "./SignOutButton";
import Link from "next/link";
import React from "react";

const NavBar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <Link href="/">Home</Link>
      {session?.user ? (
        <>
          <p>Logged in as {session.user.username}</p>
          <SignOutButton />
        </>
      ) : (
        <>
          <p>Not logged in</p>
          <Link href="/sign-in">Sign In</Link>
        </>
      )}
    </div>
  );
};

export default NavBar;
