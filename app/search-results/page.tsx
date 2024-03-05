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
    <div>
      <h1>Search Results for "{query}"</h1>
      <QuestionList questions={data} />
    </div>
  );
};

export default SearchResultsPage;
