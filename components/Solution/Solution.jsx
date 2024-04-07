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
import moment from "moment";

const Solution = async ({ solution }) => {
  const isRelated = false;
  const isReplying = false;
  const isReplies = false;
  const session = await getServerSession(authOptions);
  const utcDate = new Date(solution.createdAt);

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

  let userVote;

  if (user) {
    userVote = await db.solutionVote.findFirst({
      where: {
        solutionId: solution.id,
        userId: user.id,
      },
    });
  } else {
    userVote = null;
  }

  let replies;

  try {
    replies = await db.reply.findMany({
      where: {
        solutionId: solution.id,
      },
      include: {
        childReplies: true,
        user: true,
      },
    });
  } catch (error) {
    console.error(error);
    replies = [];
  }

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
  const isTopSolution = problem.topSolution === solution.id;

  const isAdminSolution = user.roles.includes("admin");

  const username = user.username;

  return (
    <div
      className={`max-w-md mx-auto bg-white rounded-lg shadow overflow-hidden md:max-w-2xl p-4 space-y-2 ${
        isTopSolution
          ? "border-4 border-yellow-400"
          : isAdminSolution
          ? "border-2 border-blue-500"
          : ""
      }`}
    >
      <div className="flex items-center mb-2 justify-between w-full">
        <div className="flex items-center space-x-2">
          {isReplying && <span className="text-sm text-gray-500">O</span>}
          <Link
            href={`/user/${username}`}
            className="flex items-center text-blue-600 hover:text-blue-800 font-semibold transition duration-150 ease-in-out ml-16"
          >
            <ProfileImage username={username} />
            <span className="ml-2">{username}</span>
          </Link>
        </div>
        {isRelated && <span className="text-sm text-gray-500">Related</span>}
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex flex-col items-center ">
          <SolutionUpVoteButton solutionId={solution.id} userVote={userVote} />
          <p className="text-lg font-semibold text-gray-900 ">
            {solution.voteSum}
          </p>
          <SolutionDownVoteButton
            solutionId={solution.id}
            userVote={userVote}
          />
        </div>
        <p className="text-gray-800 break-words">{solution.content}</p>
      </div>

      {/* <SolutionUpdateList solutionId={solution.id} />

      {session?.user?.id === solution.authorId && (
        <div className="text-right p-4">
          <SolutionUpdate solutionId={solution.id} />
        </div>
      )} */}

      <div className="flex items-center space-x-4 justify-between">
        {isReplies && <span className="text-sm text-gray-500">O</span>}
        <div className="text-sm text-gray-500">
          <div className="text-sm text-gray-500 ml-16">
            {moment(utcDate).fromNow()}
          </div>
        </div>

        <div className="flex-col items-center space-x-2">
          {session?.user?.roles.includes("admin") && (
            <DeleteSolutionButton solutionId={solution.id} />
          )}
          <ReplyButton
            solutionId={solution.id}
            replyId={null}
            problemId={problem.id}
          />
        </div>
      </div>

      <div className="flex justify-between">
        {problem.authorId === session?.user?.id && !isTopSolution && (
          <div className="flex items-center">
            <PinTopSolutionButton
              solutionId={solution.id}
              problemId={problem.id}
            />
          </div>
        )}
      </div>

      {replies.map((reply) => (
        <Reply key={reply.id} reply={reply} problemId={problem.id} />
      ))}
    </div>
  );
};

export default Solution;
