import React from "react";
import DeleteProblemButton from "./DeleteProblemButton";
import ProblemUpdateList from "./ProblemUpdateList";
import ProblemUpdate from "./ProblemUpdate";
import UpVoteButton from "./UpVoteButton";
import DownVoteButton from "./DownVoteButton";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";

const Problem = async ({ problem, session }) => {
  const isAdminProblem = problem.author.roles.includes("admin");
  const isWebsiteProblem = problem.author.roles.includes("website");
  const poster = await db.user.findUnique({
    where: {
      id: problem.authorId,
    },
  });
  const utcDate = new Date(problem.createdAt);
  const utcTimestamp = Date.UTC(
    utcDate.getUTCFullYear(),
    utcDate.getUTCMonth(),
    utcDate.getUTCDate(),
    utcDate.getUTCHours(),
    utcDate.getUTCMinutes(),
    utcDate.getUTCSeconds()
  );

  const ProfileImage = ({ username }) => {
    const firstLetter = username.charAt(0).toUpperCase();

    return (
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          backgroundColor: "#307e79", // Your chosen color
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "20px",
        }}
      >
        {firstLetter}
      </div>
    );
  };
  return (
    <div
      className={`max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg ${
        isWebsiteProblem
          ? "bg-yellow-50 border-4 border-blue-500"
          : isAdminProblem
          ? "border-2 border-blue-500"
          : ""
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

      <Link
        href={`/user/${poster.username}`}
        className="text-lg text-indigo-600 hover:text-indigo-900 transition duration-300 ease-in-out font-medium flex items-center p-2"
      >
        <ProfileImage username={poster.username} />
        <span className="ml-2">{poster.username}</span>
      </Link>

      {/* Title and Posted Date on same line */}
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-lg leading-tight font-medium text-black hover:underline break-words">
          {problem.title}
        </h1>
        <div className="text-sm text-gray-500">
          {new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          }).format(new Date(utcTimestamp))}
        </div>
      </div>

      <div className="flex items-center space-x-4 mr-4 ml-4 mb-4">
        <div className="flex flex-col items-center">
          <UpVoteButton problemId={problem.id} />
          {problem.voteSum}
          <DownVoteButton problemId={problem.id} />
        </div>
        <p className="text-gray-800">{problem.content}</p>
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
        {session?.user?.roles.includes("admin") && (
          <div className="text-right">
            <DeleteProblemButton problemId={problem.id} />
          </div>
        )}
      </div>

      {/* Admin Delete Button */}
    </div>
  );
};

export default Problem;
