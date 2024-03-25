"use client";

// components/ProblemList.tsx
import Link from "next/link";
import React, { useState } from "react";
import Problem from "./Problem";

const PAGE_SIZE = 5; // Number of problems per page

const ProblemList = ({ problems, session }) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!Array.isArray(problems)) {
    console.error("problems is not an array:", problems);
    return <div>No problems available</div>;
  }

  // Calculate the total number of pages
  const totalPages = Math.ceil(problems.length / PAGE_SIZE);

  // Get current page of problems
  const start = (currentPage - 1) * PAGE_SIZE;
  const currentProblems = problems.slice(start, start + PAGE_SIZE);

  // Change page handler
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div>
      {currentProblems.length > 0 ? (
        <>
          {currentProblems.map((problem) => (
            <Link
              href={`/problem/${problem.id}`}
              className="block p-2 w-2/3 mx-auto"
              key={problem.id}
            >
              <Problem problem={problem} session={session} />
            </Link>
          ))}
          <div className="flex justify-center items-center space-x-2 mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-md ${
                  index + 1 === currentPage
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ProblemList;
