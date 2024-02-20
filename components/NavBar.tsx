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
        <div>
          <Link href={`/user/${session.user.username}`}>
            {session.user.username}
          </Link>
          <SignOutButton />
        </div>
      ) : (
        <div>
          <p>Not signed in</p>
          <Link href="/sign-in">Sign In</Link>
        </div>
      )}
    </div>
  );
};

export default NavBar;
