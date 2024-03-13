import React from "react";
import { db } from "@/lib/db";
import DeleteQuestionButton from "./DeleteQuestionButton";

const Question = ({ question, session }) => {
  const createdAt = new Date(question.createdAt).toLocaleString();

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
      <div className="p-8">
        <div
          className={`uppercase tracking-wide text-sm ${
            question.open ? "text-green-500" : "text-red-500"
          } font-semibold`}
        >
          Status: {question.open ? "Open" : "Closed"}
        </div>
        <h1 className="block mt-1 text-lg leading-tight font-medium text-black hover:underline break-words">
          {question.title}
        </h1>
        <p className="mt-2 text-gray-500 break-words">{question.content}</p>
      </div>
      <div className="p-8 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <div className="text-sm text-gray-500">
              <span className="font-bold">At:</span> {createdAt}
            </div>
            <div className="text-sm text-blue-600 break-words overflow-wrap-anywhere">
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
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="text-lg font-bold">
              Prize: {question.prize} Keys
            </div>
            <div className="text-lg font-semibold">
              Votes: {question.voteSum}
            </div>
          </div>
        </div>
      </div>
      {session?.user?.roles.includes("admin") && (
        <div className="p-8 border-t border-gray-200 text-right">
          <DeleteQuestionButton questionId={question.id} />
        </div>
      )}
    </div>
  );
};

export default Question;
