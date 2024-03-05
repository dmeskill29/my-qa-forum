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
    <div className="border p-4 rounded shadow space-y-2">
      <p className="text-base">{answer.content}</p>
      <Link
        href={`/user/${username}`}
        className="text-blue-600 hover:underline"
      >
        {username}
      </Link>
      <p className="text-sm text-gray-600">
        At {new Date(answer.createdAt).toLocaleString()}
      </p>
      <AnswerUpdateList answerId={answer.id} />
      {session?.user?.id === answer.authorId && (
        <AnswerUpdate answerId={answer.id} />
      )}
      <div className="flex items-center space-x-2">
        <AnswerUpVoteButton answerId={answer.id} />
        <p>{upvotes.length - downvotes.length}</p>
        <AnswerDownVoteButton answerId={answer.id} />
      </div>
      {session?.user?.roles.includes("admin") && (
        <DeleteAnswerButton answerId={answer.id} className="mt-2" />
      )}
      {question.authorId === session?.user?.id && (
        <PinTopAnswerButton
          answerId={answer.id}
          questionId={question.id}
          className="mt-2"
        />
      )}
    </div>
  );
};

export default Answer;
