"use client";

import { signOut } from "next-auth/react";

const SignOutButton = () => {
  return (
    <div className=" mr-8 absolute right-0">
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};

export default SignOutButton;
