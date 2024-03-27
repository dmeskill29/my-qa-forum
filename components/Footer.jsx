import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} SolveCircle. All rights reserved.
        </div>
        <div className="flex space-x-4 justify-center md:justify-start">
          <Link
            href="/About"
            className="hover:underline hover:text-gray-300 transition duration-150 ease-in-out"
          >
            About
          </Link>
          <Link
            href="/Terms"
            className="hover:underline hover:text-gray-300 transition duration-150 ease-in-out"
          >
            Privacy
          </Link>
          <Link
            href="/Terms"
            className="hover:underline hover:text-gray-300 transition duration-150 ease-in-out"
          >
            Terms
          </Link>
          <Link
            href="/Contact"
            className="hover:underline hover:text-gray-300 transition duration-150 ease-in-out"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
