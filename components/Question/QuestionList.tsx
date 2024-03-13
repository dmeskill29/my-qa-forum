"use client";

// components/QuestionList.tsx
import Link from "next/link";
import React, { useState } from "react";
import Question from "./Question";

const PAGE_SIZE = 5; // Number of questions per page

const QuestionList = ({ questions, session }) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!Array.isArray(questions)) {
    console.error("questions is not an array:", questions);
    return <div>No questions available</div>;
  }

  // Calculate the total number of pages
  const totalPages = Math.ceil(questions.length / PAGE_SIZE);

  // Get current page of questions
  const start = (currentPage - 1) * PAGE_SIZE;
  const currentQuestions = questions.slice(start, start + PAGE_SIZE);

  // Change page handler
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div>
      {currentQuestions.map((question) => (
        <Link href={`/question/${question.id}`} className="block p-6">
          <Question question={question} session={session} />
        </Link>
      ))}
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
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
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuestionList;
