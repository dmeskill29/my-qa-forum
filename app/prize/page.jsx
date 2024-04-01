import React from "react";
import { db } from "@/lib/db";
import FeedLinks from "@/components/FeedLinks";
import Problem from "@/components/Problem/Problem";
import Link from "next/link";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const page = async ({ searchParams }) => {
  const session = await getServerSession(authOptions);
  const startProblems = await db.problem.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      solutions: true,
      author: true, // Assuming the relation field name is `author`
    },
  });

  const problems = startProblems.sort((a, b) => {
    // Calculate total prize by combining both types of keys, defaulting to 0 if they're not set
    const totalPrizeA = (a.prizeInCircleKeys || 0) + (a.prizeInStarKeys || 0);
    const totalPrizeB = (b.prizeInCircleKeys || 0) + (b.prizeInStarKeys || 0);

    // Sort by total prize in descending order
    return totalPrizeB - totalPrizeA;
  });

  const page = searchParams;
  const pageNumber = page.page === undefined ? 1 : page.page;
  const PAGE_SIZE = 5; // Number of problems per page

  if (!Array.isArray(problems)) {
    console.error("problems is not an array:", problems);
    return <div>No problems available</div>;
  }

  if (pageNumber < 1) {
    console.error("pageNumber must be a positive number:", pageNumber);
    return null;
  }

  // Calculate the total number of pages
  const totalPages = Math.ceil(problems.length / PAGE_SIZE);

  // Get current page of problems
  const start = (pageNumber - 1) * PAGE_SIZE;
  const currentProblems = problems.slice(start, start + PAGE_SIZE);
  if (!session) {
    return (
      <p className="text-center mt-8">
        Please{" "}
        <Link href="/sign-in" className="text-blue-600 hover:underline">
          sign in
        </Link>{" "}
        to view the feed.
      </p>
    );
  }
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4  py-4">
      <FeedLinks />
      {currentProblems.length > 0 ? (
        <>
          {currentProblems.map((problem) => (
            <Link
              href={`/problem/${problem.id}`}
              className="block p-2 lg:w-2/3 mx-auto sm:w-full"
              key={problem.id}
            >
              <Problem problem={problem} />
            </Link>
          ))}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-4">
              {pageNumber > 1 && (
                <Link
                  href={`/prize?page=${pageNumber - 1}`}
                  className="pagination-link"
                  aria-label="Previous page"
                >
                  Previous
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, index) => (
                <Link
                  key={index}
                  href={`/prize?page=${index + 1}`}
                  className={`pagination-link ${
                    index + 1 === pageNumber ? "pagination-link--active" : ""
                  }`}
                  aria-current={index + 1 === pageNumber ? "page" : undefined}
                >
                  {index + 1}
                </Link>
              ))}
              {pageNumber < totalPages && (
                <Link
                  href={`/prize?page=${parseInt(pageNumber, 10) + 1}`}
                  className="pagination-link"
                  aria-label="Next page"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

export default page;
