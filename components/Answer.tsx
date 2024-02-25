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
    <div>
      <p>{answer.text}</p>
      <Link href={`/user/${username}`}>{username}</Link>
      <p>At {new Date(answer.createdAt).toLocaleString()}</p>
      <AnswerUpdateList answerId={answer.id} />
      {session?.user?.id === answer.authorId && (
        <AnswerUpdate answerId={answer.id} />
      )}
      <AnswerUpVoteButton answerId={answer.id} />
      <p>{upvotes.length - downvotes.length}</p>
      <AnswerDownVoteButton answerId={answer.id} />
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
