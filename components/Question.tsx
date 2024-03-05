import React from "react";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DeleteQuestionButton from "./DeleteQuestionButton";

const Question = async ({ questionId }) => {
  const session = await getServerSession(authOptions);
  const question = await db.question.findUnique({
    where: {
      id: questionId,
    },
    include: {
      votes: true,
    },
  });

  const upVotes = await db.questionVote.findMany({
    where: {
      questionId: question.id,
      type: "UP",
    },
  });

  const downVotes = await db.questionVote.findMany({
    where: {
      questionId: question.id,
      type: "DOWN",
    },
  });

  const createdAt = new Date(question.createdAt).toLocaleString();
  const user = await db.user.findUnique({
    where: {
      id: question.authorId,
    },
  });

  const username = user.username;

  return (
    <div className="border p-4 mb-4">
      <h1 className="text-2xl font-bold mb-4">Title: {question.title}</h1>
      <p className="text-lg mb-2">By {username}</p>
      <p className="text-sm text-gray-600 mb-2">At {createdAt}</p>
      <p className="text-base mb-4">Content: {question.content}</p>
      <p className="text-sm text-blue-600 mb-2">Tags: {question.tags}</p>
      <p className="text-lg font-semibold mb-2">Prize: {question.prize}</p>
      <p className="text-lg font-semibold mb-4">
        Votes: {upVotes.length - downVotes.length}
      </p>
      {session?.user?.roles.includes("admin") && (
        <div className="mt-4">
          <DeleteQuestionButton questionId={questionId} />
        </div>
      )}
    </div>
  );
};

export default Question;
