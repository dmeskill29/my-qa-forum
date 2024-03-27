import React from "react";
import DeleteProblemButton from "./DeleteProblemButton";
import ProblemUpdateList from "./ProblemUpdateList";
import ProblemUpdate from "./ProblemUpdate";
import UpVoteButton from "./UpVoteButton";
import DownVoteButton from "./DownVoteButton";
import Image from "next/image";

const Problem = ({ problem, session }) => {
  const isAdminProblem = problem.author.roles.includes("admin");
  return (
    <div
      className={`max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg ${
        isAdminProblem ? "border-4 border-green-500" : ""
      }`}
    >
      <div className="flex justify-between items-center p-4">
        {/* Status in top left */}
        <div
          className={`uppercase tracking-wide text-sm ${
            problem.open ? "text-green-500" : "text-red-500"
          } font-semibold`}
        >
          {problem.open ? "Open" : "Closed"}
        </div>

        {/* Prize in top right */}
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

      {/* Title and Posted Date on same line */}
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-lg leading-tight font-medium text-black hover:underline break-words">
          {problem.title}
        </h1>
        <div className="text-sm text-gray-500 flex flex-col items-end">
          {" "}
          {new Date(problem.createdAt).toLocaleDateString()} at{" "}
          {new Date(problem.createdAt).toLocaleTimeString()}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 border-b border-gray-200">
        <p className="text-gray-500 break-words">{problem.content}</p>
      </div>

      <ProblemUpdateList problem={problem} />

      {session?.user?.id === problem.authorId && (
        <div className="text-right p-4">
          <ProblemUpdate problemId={problem.id} />
        </div>
      )}

      {/* Votes in bottom left and Tags in bottom right */}
      <div className="p-4 flex justify-between items-center">
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
        <div className="text-lg font-semibold text-black flex items-center space-x-2">
          <UpVoteButton problemId={problem.id} />
          {problem.voteSum}
          <DownVoteButton problemId={problem.id} />
        </div>
      </div>

      {/* Admin Delete Button */}
      {session?.user?.roles.includes("admin") && (
        <div className="text-right p-4">
          <DeleteProblemButton problemId={problem.id} />
        </div>
      )}
    </div>
  );
};

export default Problem;
