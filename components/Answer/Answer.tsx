import React from "react";
import { db } from "@/lib/db";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DeleteAnswerButton from "./DeleteAnswerButton";
// import AnswerUpdate from "./AnswerUpdate";
// import AnswerUpdateList from "./AnswerUpdateList";
import AnswerUpVoteButton from "./AnswerUpVoteButton";
import AnswerDownVoteButton from "./AnswerDownVoteButton";
import PinTopAnswerButton from "./PinTopAnswerButton";

const Answer = async ({ answer }) => {
  const session = await getServerSession(authOptions);
  const user = await db.user.findUnique({
    where: {
      id: answer.authorId,
    },
  });
  const question = await db.question.findUnique({
    where: {
      id: answer.questionId,
    },
  });

  const username = user.username;

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow overflow-hidden md:max-w-2xl p-4 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <Link
          href={`/user/${username}`}
          className="text-blue-600 hover:text-blue-800 font-semibold transition duration-150 ease-in-out"
        >
          {username}
        </Link>
        <p className="text-sm text-gray-500">
          {new Date(answer.createdAt).toLocaleDateString()} at{" "}
          {new Date(answer.createdAt).toLocaleTimeString()}
        </p>
      </div>
      <p className="text-gray-800 text-base leading-relaxed">
        {answer.content}
      </p>
      <div className="flex items-center justify-between">
        {question.authorId === session?.user?.id && (
          <div className="flex items-center">
            <PinTopAnswerButton answerId={answer.id} questionId={question.id} />
          </div>
        )}
        <div className="flex items-center">
          <AnswerUpVoteButton answerId={answer.id} />
          <p className="text-lg font-semibold text-gray-900 mr-2 ">
            {answer.voteSum}
          </p>
          <AnswerDownVoteButton answerId={answer.id} />
        </div>
      </div>

      {session?.user?.roles.includes("admin") && (
        <div className="space-y-4">
          <DeleteAnswerButton answerId={answer.id} />
        </div>
      )}
    </div>
  );
};

export default Answer;
