import React from "react";
import { db } from "@/lib/db";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DeleteSolutionButton from "./DeleteSolutionButton";
import SolutionUpdate from "./SolutionUpdate";
import SolutionUpdateList from "./SolutionUpdateList";
import SolutionUpVoteButton from "./SolutionUpVoteButton";
import SolutionDownVoteButton from "./SolutionDownVoteButton";
import PinTopSolutionButton from "./PinTopSolutionButton";
import ReplyButton from "../Reply/ReplyButton";
import Reply from "../Reply/Reply";

const Solution = async ({ solution }) => {
  const session = await getServerSession(authOptions);
  const user = await db.user.findUnique({
    where: {
      id: solution.authorId,
    },
  });
  const problem = await db.problem.findUnique({
    where: {
      id: solution.problemId,
    },
  });

  const replies = await db.reply.findMany({
    where: {
      solutionId: solution.id,
    },
    include: {
      childReplies: true,
    },
  });

  const isTopSolution = problem.topSolution === solution.id;

  const isAdminSolution = user.roles.includes("admin");

  const username = user.username;

  return (
    <div
      className={`max-w-md mx-auto bg-white rounded-lg shadow overflow-hidden md:max-w-2xl p-4 space-y-6 ${
        isTopSolution
          ? "border-4 border-yellow-400"
          : isAdminSolution
          ? "border-2 border-blue-500"
          : ""
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <Link
          href={`/user/${username}`}
          className="text-blue-600 hover:text-blue-800 font-semibold transition duration-150 ease-in-out"
        >
          {username}
        </Link>
        <p className="text-sm text-gray-500">
          {new Date(solution.createdAt).toLocaleDateString()} at{" "}
          {new Date(solution.createdAt).toLocaleTimeString()}
        </p>
      </div>
      <p className="text-gray-800 text-base leading-relaxed">
        {solution.content}
      </p>

      <SolutionUpdateList solutionId={solution.id} />

      {session?.user?.id === solution.authorId && (
        <div className="text-right p-4">
          <SolutionUpdate solutionId={solution.id} />
        </div>
      )}

      <div className="flex justify-between">
        {problem.authorId === session?.user?.id && !isTopSolution && (
          <div className="flex items-center">
            <PinTopSolutionButton
              solutionId={solution.id}
              problemId={problem.id}
            />
          </div>
        )}
        <div className="flex items-center ml-auto">
          <SolutionUpVoteButton solutionId={solution.id} />
          <p className="text-lg font-semibold text-gray-900 mr-2">
            {solution.voteSum}
          </p>
          <SolutionDownVoteButton solutionId={solution.id} />
        </div>
      </div>

      <div className="ml-4 flex justify-between">
        <ReplyButton solutionId={solution.id} replyId={null} />
        {session?.user?.roles.includes("admin") && (
          <DeleteSolutionButton solutionId={solution.id} />
        )}
      </div>

      {replies.map((reply) => (
        <Reply key={reply.id} reply={reply} />
      ))}
    </div>
  );
};

export default Solution;
