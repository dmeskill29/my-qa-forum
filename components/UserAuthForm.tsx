"use client";

import { signIn } from "next-auth/react";
import * as React from "react";

const UserAuthForm = () => {
  return <button onClick={() => signIn()}>Login with Google</button>;
};

export default UserAuthForm;
