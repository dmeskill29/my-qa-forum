import React from "react";

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-full p-8 max-w-md mx-auto flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Contact Us
        </h2>
        <p className="text-gray-600 mb-4 text-center">
          Have questions or need help? Feel free to reach out to us.
        </p>
        <div className="space-y-2">
          <div className="flex items-center text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>919.272.6610</span>
          </div>
          <div className="flex items-center text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 2a4 4 0 014 4v12a4 4 0 01-4 4H8a4 4 0 01-4-4V6a4 4 0 014-4h8zm0 2H8a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2zm-1 4h-2v4h2V8z"
              />
            </svg>
            <a
              href="mailto:d@solvecircle.app"
              className="hover:text-blue-500 transition duration-150 ease-in-out"
            >
              d@solvecircle.app
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
