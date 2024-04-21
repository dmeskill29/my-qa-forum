// pages/email-verified.js

import React from "react";
import Link from "next/link";

const EmailVerified = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">Email Verified!</h1>
        <p className="text-lg mb-6">
          Your email has been successfully verified. You can now access all the
          features of our application.
        </p>
        <Link
          href="/sign-in"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Sign In Now
        </Link>
      </div>
    </div>
  );
};

export default EmailVerified;
