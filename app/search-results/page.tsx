// pages/search-results/index.js
import React, { useState } from "react";
import QuestionList from "@/components/QuestionList"; // Adjust the import path as necessary
import { db } from "@/lib/db";

const SearchResultsPage = async ({ searchParams }) => {
  const search = searchParams;
  const query = search.query;

  const data = await db.question.findMany({
    where: {
      OR: [
        {
          title: {
            contains: query,
          },
        },
        {
          content: {
            contains: query,
          },
        },
        {
          tags: {
            contains: query,
          },
        },
      ],
    },
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Search Results for "<span className="text-blue-500">{query}</span>"
      </h1>
      <QuestionList questions={data} />
    </div>
  );
};

export default SearchResultsPage;
