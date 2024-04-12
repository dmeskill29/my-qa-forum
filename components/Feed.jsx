import React from "react";
import Link from "next/link";
import Problem from "./Problem/Problem";

const Feed = ({ problems, pageNumber, totalPages, type, pageSize }) => {
  const start = (pageNumber - 1) * pageSize;
  const currentProblems = problems.slice(start, start + pageSize);

  const pageType = type === "Feed" ? "Feed" : type;

  return (
    <>
      {currentProblems.map((problem) => (
        <Link
          href={`/problem/${problem.id}`}
          className="block p-2 lg:w-4/6 mx-auto sm:w-full"
          key={problem.id}
        >
          <Problem problem={problem} />
        </Link>
      ))}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          {pageNumber > 1 && (
            <Link
              href={`/${pageType}?page=${pageNumber - 1}`}
              className="pagination-link"
              aria-label="Previous page"
            >
              Previous
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, index) => (
            <Link
              key={index}
              href={`/${pageType}?page=${index + 1}`}
              className={`pagination-link ${
                index === pageNumber - 1
                  ? "pagination-link--active font-bold"
                  : ""
              }`}
              aria-current={index + 1 === pageNumber ? "page" : undefined}
            >
              {index + 1}
            </Link>
          ))}
          {pageNumber < totalPages && (
            <Link
              href={`/${pageType}?page=${parseInt(pageNumber, 10) + 1}`}
              className="pagination-link"
              aria-label="Next page"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default Feed;
