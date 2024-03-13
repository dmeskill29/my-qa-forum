// pages/search-results/index.js
import React, { useState } from "react";
import QuestionList from "@/components/Question/QuestionList"; // Adjust the import path as necessary
import { db } from "@/lib/db";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const SearchResultsPage = async ({ searchParams }) => {
  const session = await getServerSession(authOptions);
  const search = searchParams;
  const query = search.query;
  const type = search.type; // Assuming 'type' can be 'all', 'title', 'content', or 'tags'

  let whereCondition;

  switch (type) {
    case "title":
      whereCondition = {
        title: {
          contains: query,
          mode: "insensitive", // Assumes case-insensitive search
        },
      };
      break;
    case "content":
      whereCondition = {
        content: {
          contains: query,
          mode: "insensitive",
        },
      };
      break;
    case "tags":
      whereCondition = {
        tags: {
          contains: query,
          mode: "insensitive",
        },
      };
      break;
    case "all":
    default:
      whereCondition = {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            tags: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      };
      break;
  }

  const data = await db.question.findMany({
    where: whereCondition,
    orderBy: { createdAt: "desc" },
  });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Search Results for "<span className="text-blue-500">{query}</span>"
      </h1>

      <div className="flex justify-center space-x-4 mb-4">
        <Link
          href={`/search-results?query=${encodeURIComponent(query)}&type=all`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-150 ease-in-out text-center"
        >
          All
        </Link>

        <Link
          href={`/search-results?query=${encodeURIComponent(query)}&type=title`}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-150 ease-in-out text-center"
        >
          Title
        </Link>

        <Link
          href={`/search-results?query=${encodeURIComponent(
            query
          )}&type=content`}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition duration-150 ease-in-out text-center"
        >
          Content
        </Link>

        <Link
          href={`/search-results?query=${encodeURIComponent(query)}&type=tags`}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-150 ease-in-out text-center"
        >
          Tags
        </Link>
      </div>

      <QuestionList questions={data} />
    </div>
  );
};

export default SearchResultsPage;
