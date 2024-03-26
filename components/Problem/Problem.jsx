import React from "react";
import DeleteProblemButton from "./DeleteProblemButton";
import Image from "next/image";

const Problem = ({ problem }) => {
  const createdAt = new Date(problem.createdAt).toLocaleString();

  const isAdminProblem = problem.author.roles.includes("admin");

  return (
    <div
      className={`max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg ${
        isAdminProblem ? "border-4 border-green-500" : ""
      }`}
    >
      {/* Top bar for Status and Prize */}
      <div className="flex justify-between items-center p-4">
        <div
          className={`uppercase tracking-wide text-sm ${
            problem.open ? "text-green-500" : "text-red-500"
          } font-semibold`}
        >
          {problem.open ? "Open" : "Closed"}
        </div>
        {/* Wrap the Keys and Star Keys in a div and use flex-col for vertical stacking */}
        <div className="flex justify-center items-end">
          <div className="flex items-center text-lg font-bold text-black">
            <span>{problem.prizeInCircleKeys}</span>
            <Image
              src="/CircleKey.png"
              alt="Circle Key"
              width={32}
              height={32}
              className="ml-2 mr-4"
            />
          </div>
          <div className="flex items-center text-lg font-bold text-black">
            <span>{problem.prizeInStarKeys}</span>
            <Image
              src="/StarKey.png"
              alt="Star Key"
              width={32}
              height={32}
              className="ml-2"
            />
          </div>
        </div>
      </div>

      {/* Title and Posted Date */}
      <div className="flex justify-between items-center p-4 ">
        <h1 className="text-lg leading-tight font-medium text-black hover:underline break-words">
          {problem.title}
        </h1>
        <div className="text-sm text-gray-500">{createdAt}</div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-500 break-words">{problem.content}</p>
      </div>

      {/* Bottom bar for Votes and Tags */}
      <div className="flex justify-between items-center p-4">
        <div className="text-sm text-blue-600 flex-wrap">
          {problem.tags && (
            <>
              Tags:{" "}
              {problem.tags.split(",").map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                  #{tag.trim()}
                </span>
              ))}
            </>
          )}
        </div>
        <div className="text-lg font-semibold text-black">
          Votes: {problem.voteSum}
        </div>
      </div>

      {/* Admin Delete Button, if applicable */}
      {/* {session?.user?.roles.includes("admin") && (
        <div className="text-right p-4">
          <DeleteProblemButton problemId={problem.id} />
        </div>
      )} */}
    </div>
  );
};

export default Problem;
