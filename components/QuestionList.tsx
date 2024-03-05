// components/QuestionList.tsx
import Link from "next/link";
import React from "react";
import Question from "./Question";

const QuestionList = ({ questions }) => {
  // Check if questions is an array before using map
  if (!Array.isArray(questions)) {
    console.error("questions is not an array:", questions);
    return <div>No questions available</div>;
  }
  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <Link
          href={`/${question.id}`}
          key={question.id}
          className="block bg-white shadow hover:shadow-lg transition rounded-lg p-4"
        >
          <Question questionId={question.id} />
        </Link>
      ))}
    </div>
  );
};

export default QuestionList;
