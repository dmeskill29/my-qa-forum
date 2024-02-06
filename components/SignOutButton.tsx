"use client";

import { signOut } from "next-auth/react";

const SignOutButton = () => {
  return (
    <div>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};

export default SignOutButton;
