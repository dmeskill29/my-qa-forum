import React from "react";
import Link from "next/link";

const NoUser = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <svg
          className="w-24 h-24 mx-auto text-indigo-500"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856C18.448 19 19 18.105 19 17V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10c0 1.105.552 2 1.062 2zM9 21h6a2 2 0 002-2v-1H7v1a2 2 0 002 2z"></path>
        </svg>
        <h1 className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
          User not found
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400 sm:text-lg">
          The user you are looking for does not exist. Please check the URL and
          try again.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Go back to the homepage<span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NoUser;
