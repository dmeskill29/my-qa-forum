import React from "react";
import DeleteQuestionButton from "./DeleteQuestionButton";

const Question = ({ question, session }) => {
  const createdAt = new Date(question.createdAt).toLocaleString();

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
      {/* Top bar for Status and Prize */}
      <div className="flex justify-between items-center p-4">
        <div
          className={`uppercase tracking-wide text-sm ${
            question.open ? "text-green-500" : "text-red-500"
          } font-semibold`}
        >
          {question.open ? "Open" : "Closed"}
        </div>
        {/* Wrap the Keys and Star Keys in a div and use flex-col for vertical stacking */}
        <div className="flex flex-col justify-center items-end">
          <div className="text-lg font-bold text-black">
            {question.prizeInKeys} Keys
          </div>
          <div className="text-lg font-bold text-black">
            {question.prizeInStarKeys} Star Keys
          </div>
        </div>
      </div>

      {/* Title and Posted Date */}
      <div className="flex justify-between items-center p-4 ">
        <h1 className="text-lg leading-tight font-medium text-black hover:underline break-words">
          {question.title}
        </h1>
        <div className="text-sm text-gray-500">{createdAt}</div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-500 break-words">{question.content}</p>
      </div>

      {/* Bottom bar for Votes and Tags */}
      <div className="flex justify-between items-center p-4">
        <div className="text-sm text-blue-600 flex-wrap">
          Tags:{" "}
          {question.tags.split(",").map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
            >
              #{tag.trim()}
            </span>
          ))}
        </div>
        <div className="text-lg font-semibold text-black">
          Votes: {question.voteSum}
        </div>
      </div>

      {/* Admin Delete Button, if applicable */}
      {session?.user?.roles.includes("admin") && (
        <div className="text-right p-4">
          <DeleteQuestionButton questionId={question.id} />
        </div>
      )}
    </div>
  );
};

export default Question;
