"use client";
import React, { useState } from "react";
import Link from "next/link";

const UserSolutionList = ({ solutions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const solutionsPerPage = 5; // Adjust number of solutions per page as needed

  // Calculate the indexes for slicing the solutions array
  const indexOfLastSolution = currentPage * solutionsPerPage;
  const indexOfFirstSolution = indexOfLastSolution - solutionsPerPage;
  const currentSolutions = solutions.slice(
    indexOfFirstSolution,
    indexOfLastSolution
  );

  // Calculate page count
  const pageCount = Math.ceil(solutions.length / solutionsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {currentSolutions.length > 0 ? (
        <>
          <div className="space-y-4">
            {currentSolutions.map((solution) => (
              <Link
                href={`/question/${solution.questionId}`}
                key={solution.id}
                className="block w-3/4 mx-auto p-4 rounded-lg bg-white transition duration-500 ease-in-out transform hover:-translate-y-1"
              >
                <p className="text-gray-700">{solution.content}</p>
                <p className="mt-2 text-sm text-gray-500">
                  At {new Date(solution.createdAt).toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
          <div className="flex justify-center items-center space-x-2 mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: pageCount }, (_, index) => (
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
              disabled={currentPage === pageCount}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : null}
    </>
  );
};

export default UserSolutionList;
