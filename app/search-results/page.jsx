// pages/search-results/index.js
import React from "react";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SearchFilters from "@/components/SearchFilters";
import Link from "next/link";
import User from "@/components/User";
import Problem from "@/components/Problem/Problem";
import Solution from "@/components/Solution/Solution";

const PAGE_SIZE = 10; // Number of items per page

const SearchResultsPage = async ({ searchParams }) => {
  const session = await getServerSession(authOptions);
  const search = searchParams;
  const query = search.query;
  const type = search.type;
  const pageNumber = search.page === undefined ? 1 : search.page;

  // Assuming 'type' can be 'problems', 'solutions', or 'users'
  let whereCondition = {};
  let orderBy = {};
  let include = {};
  let results = [];

  if (type === "problems") {
    whereCondition = {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
        { tags: { contains: query, mode: "insensitive" } },
      ],
    };
    orderBy = { createdAt: "desc" };
    include = {
      solutions: true,
      author: true,
    };
  } else if (type === "users") {
    whereCondition = {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { username: { contains: query, mode: "insensitive" } },
      ],
    };
    orderBy = { createdAt: "desc" };
  }

  if (type === "problems") {
    results = await db.problem.findMany({
      where: whereCondition,
      orderBy,
      include,
    });
  } else if (type === "users") {
    results = await db.user.findMany({
      where: whereCondition,
      orderBy,
      include,
    });
  }

  if (!Array.isArray(results)) {
    console.error("results is not an array:", results);
    return <div>No results available</div>;
  }

  if (pageNumber < 1) {
    console.error("pageNumber must be a positive number:", pageNumber);
    return null;
  }

  // Calculate the total number of pages
  const totalPages = Math.ceil(results.length / PAGE_SIZE);

  // Get current page of results
  const start = (pageNumber - 1) * PAGE_SIZE;
  const currentResults = results.slice(start, start + PAGE_SIZE);

  if (!session) {
    return (
      <p className="text-center mt-8">
        Please{" "}
        <Link href="/sign-in" className="text-blue-600 hover:underline">
          sign in
        </Link>{" "}
        to search.
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
      {currentResults.length > 0 ? (
        <>
          {type === "users"
            ? currentResults.map((user) => (
                <Link
                  href={`/user/${user.username}`}
                  className="block p-2 mx-auto mb-4 w-full max-w-3xl"
                  key={user.id}
                >
                  <User user={user} />
                </Link>
              ))
            : type === "problems"
            ? currentResults.map((problem) => (
                <Link
                  href={`/problem/${problem.id}`}
                  className="block p-2 mx-auto mb-4 w-full max-w-3xl"
                  key={problem.id}
                >
                  <Problem problem={problem} />
                </Link>
              ))
            : null}
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
                    index + 1 === Number(pageNumber)
                      ? "pagination-link--active"
                      : ""
                  }`}
                  aria-current={
                    index + 1 === Number(pageNumber) ? "page" : undefined
                  }
                >
                  {index + 1 === Number(pageNumber) ? (
                    <strong>{index + 1}</strong>
                  ) : (
                    index + 1
                  )}
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
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResultsPage;
