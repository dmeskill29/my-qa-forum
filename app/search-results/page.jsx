// pages/search-results/index.js
import React from "react";
import QuestionList from "@/components/Question/QuestionList"; // Adjust the import path as necessary
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SearchFilters from "@/components/SearchFilters";

const SearchResultsPage = async ({ searchParams }) => {
  const session = await getServerSession(authOptions);
  const search = searchParams;
  const query = search.query;
  const type = search.type; // Assuming 'type' can be 'all', 'title', 'content', or 'tags'

  const whereCondition = {
    title: { contains: query, mode: "insensitive" },
    content: { contains: query, mode: "insensitive" },
    tags: { contains: query, mode: "insensitive" },
  }[type] ?? {
    OR: [
      { title: { contains: query, mode: "insensitive" } },
      { content: { contains: query, mode: "insensitive" } },
      { tags: { contains: query, mode: "insensitive" } },
    ],
  };

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
        Search Results for &quot;<span className="text-blue-500">{query}</span>
        &quot;
      </h1>

      <SearchFilters query={query} />

      <QuestionList questions={data} />
    </div>
  );
};

export default SearchResultsPage;
