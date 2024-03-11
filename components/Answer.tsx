import React from "react";
import { db } from "@/lib/db";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DeleteAnswerButton from "./DeleteAnswerButton";
import AnswerUpdate from "./AnswerUpdate";
import AnswerUpdateList from "./AnswerUpdateList";
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

  const upvotes = await db.answerVote.findMany({
    where: {
      answerId: answer.id,
      type: "UP",
    },
  });

  const downvotes = await db.answerVote.findMany({
    where: {
      answerId: answer.id,
      type: "DOWN",
    },
  });

  const username = user.username;

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <Link
          href={`/user/${username}`}
          className="text-blue-600 hover:underline transition duration-300 ease-in-out"
        >
          {username}
        </Link>
        <p className="text-sm text-gray-600">
          At {new Date(answer.createdAt).toLocaleString()}
        </p>
      </div>
      <p className="text-base">{answer.content}</p>
      <div className="flex items-center space-x-2">
        <AnswerUpVoteButton answerId={answer.id} />
        <p className="text-lg font-bold text-gray-700">
          {upvotes.length - downvotes.length}
        </p>
        <AnswerDownVoteButton answerId={answer.id} />
      </div>
      <AnswerUpdateList answerId={answer.id} />
      {session?.user?.id === answer.authorId && (
        <AnswerUpdate answerId={answer.id} />
      )}
      {session?.user?.roles.includes("admin") && (
        <DeleteAnswerButton answerId={answer.id} />
      )}
      {question.authorId === session?.user?.id && (
        <PinTopAnswerButton answerId={answer.id} questionId={question.id} />
      )}
    </div>
  );
};

export default Answer;
