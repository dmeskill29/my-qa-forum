"use client";

import { signIn } from "next-auth/react";
import * as React from "react";

const UserAuthForm = () => {
  return (
    <button
      onClick={() => signIn()}
      className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#4285F4] hover:bg-[#357ae8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285F4] transition duration-150 ease-in-out"
    >
      <svg
        className="w-6 h-6 mr-2 -ml-1"
        aria-hidden="true"
        focusable="false"
        data-prefix="fab"
        data-icon="google"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 488 512"
      >
        <path
          fill="currentColor"
          d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.7 163.5 65.8l-66.9 64.7C306.6 101.6 280 88 248 88c-76.7 0-139 63.5-139 141.8s62.3 141.8 139 141.8c68.3 0 117.5-45.5 135.4-108.6H248v-85.6h236.1c2.3 12.7 3.9 25.9 3.9 39.4z"
        ></path>
      </svg>
      Login with Google
    </button>
  );
};

export default UserAuthForm;
