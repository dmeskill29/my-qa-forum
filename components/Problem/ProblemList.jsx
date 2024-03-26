// components/ProblemList.tsx
import Link from "next/link";
import React from "react";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";

const Problem = dynamic(() => import("./Problem"));

const PAGE_SIZE = 5; // Number of problems per page

const ProblemList = ({ problems, session, currentPage = 1 }) => {
  if (!Array.isArray(problems)) {
    console.error("problems is not an array:", problems);
    return <div>No problems available</div>;
  }

  if (currentPage < 1) {
    console.error("currentPage must be a positive number:", currentPage);
    return null;
  }

  // Calculate the total number of pages
  const totalPages = Math.ceil(problems.length / PAGE_SIZE);

  // Get current page of problems
  const start = (currentPage - 1) * PAGE_SIZE;
  const currentProblems = problems.slice(start, start + PAGE_SIZE);

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
            {currentPage > 1 && (
              <Link
                href={`/problems?page=${currentPage - 1}`}
                className="pagination-link"
                aria-label="Previous page"
              >
                Previous
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, index) => (
              <Link
                key={index}
                href={`/problems?page=${index + 1}`}
                className={`pagination-link ${
                  index + 1 === currentPage ? "pagination-link--active" : ""
                }`}
                aria-current={index + 1 === currentPage ? "page" : undefined}
              >
                {index + 1}
              </Link>
            ))}
            {currentPage < totalPages && (
              <Link
                href={`/problems?page=${currentPage + 1}`}
                className="pagination-link"
                aria-label="Next page"
              >
                Next
              </Link>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

ProblemList.propTypes = {
  problems: PropTypes.arrayOf(PropTypes.object).isRequired,
  session: PropTypes.object, // Define the shape of the session object if needed
  currentPage: PropTypes.number,
};

export default ProblemList;
