import React from "react";
import DeleteQuestionButton from "./DeleteQuestionButton";
import QuestionUpdateList from "./QuestionUpdateList";
import QuestionUpdate from "./QuestionUpdate";
import UpVoteButton from "./UpVoteButton";
import DownVoteButton from "./DownVoteButton";

const Question = ({ question, session }) => {
  const createdAt = new Date(question.createdAt).toLocaleString();

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
      <div className="flex justify-between items-center p-4">
        {/* Status in top left */}
        <div
          className={`uppercase tracking-wide text-sm ${
            question.open ? "text-green-500" : "text-red-500"
          } font-semibold`}
        >
          {question.open ? "Open" : "Closed"}
        </div>

        {/* Prize in top right */}
        <div className="flex justify-center items-end">
          <div className="flex items-center text-lg font-bold text-black">
            <span>{question.prizeInKeys}</span>
            <img src="/CircleKey.png" className="h-7 w-8 ml-2 mr-4" />
          </div>
          <div className="flex items-center text-lg font-bold text-black">
            <span>{question.prizeInStarKeys}</span>
            <img src="/StarKey.png" className="h-7 w-8 ml-2" />
          </div>
        </div>
      </div>

      {/* Title and Posted Date on same line */}
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-lg leading-tight font-medium text-black hover:underline break-words">
          {question.title}
        </h1>
        <div className="text-sm text-gray-500"> {createdAt}</div>
      </div>

      {/* Content */}
      <div className="p-4 border-b border-gray-200">
        <p className="text-gray-500 break-words">{question.content}</p>
      </div>

      <QuestionUpdateList question={question} />
      <QuestionUpdate questionId={question.id} />

      {/* Votes in bottom left and Tags in bottom right */}
      <div className="p-4 flex justify-between items-center">
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
        <div className="text-lg font-semibold text-black flex items-center space-x-2">
          <UpVoteButton questionId={question.id} />
          {question.voteSum}
          <DownVoteButton questionId={question.id} />
        </div>
      </div>

      {/* Admin Delete Button */}
      {session?.user?.roles.includes("admin") && (
        <div className="text-right p-4">
          <DeleteQuestionButton questionId={question.id} />
        </div>
      )}
    </div>
  );
};

export default Question;
