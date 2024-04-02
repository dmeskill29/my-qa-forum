// pages/search-results/index.js
import React from "react";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SearchFilters from "@/components/SearchFilters";
import Link from "next/link";
import Problem from "@/components/Problem/Problem";

const PAGE_SIZE = 5; // Number of problems per page

const SearchResultsPage = async ({ searchParams }) => {
  const session = await getServerSession(authOptions);
  const search = searchParams;
  const query = search.query;
  const type = search.type;
  const pageNumber = search.page === undefined ? 1 : search.page;

  // Assuming 'type' can be 'all', 'title', 'content', or 'tags'
  const whereCondition =
    type === "all"
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
            { tags: { contains: query, mode: "insensitive" } },
          ],
        }
      : {
          [type]: { contains: query, mode: "insensitive" },
        };

  const problems = await db.problem.findMany({
    where: whereCondition,
    orderBy: { createdAt: "desc" },
    include: {
      solutions: true,
      author: true,
    },
  });

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
        to search for problems.
      </p>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Search Results for &quot;
        <span className="text-blue-500">{query}</span>
        &quot;
      </h1>

      <SearchFilters query={query} />
      {currentProblems.length > 0 ? (
        <>
          {currentProblems.map((problem) => (
            <Link
              href={`/problem/${problem.id}`}
              className="block p-2 w-2/3 mx-auto"
              key={problem.id}
            >
              <Problem problem={problem} />
            </Link>
          ))}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-4">
              {pageNumber > 1 && (
                <Link
                  href={`/search-results?query=${query}&type=${type}&page=${
                    pageNumber - 1
                  }`}
                  className="pagination-link"
                  aria-label="Previous page"
                >
                  Previous
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, index) => (
                <Link
                  key={index}
                  href={`/search-results?query=${query}&type=${type}&page=${
                    index + 1
                  }`}
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
                  href={`/search-results?query=${query}&type=${type}&page=${
                    parseInt(pageNumber, 10) + 1
                  }`}
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

export default SearchResultsPage;
