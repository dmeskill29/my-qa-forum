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
  });
  const createdAt = new Date(question.createdAt).toLocaleString();
  const user = await db.user.findUnique({
    where: {
      id: question.authorId,
    },
  });

  const username = user.username;

  return (
    <div>
      <h1>{question.title}</h1>
      <p>By {username} </p>
      <p>At {createdAt}</p>
      <p>{question.content}</p>
      <p>Prize: {question.prize}</p>
      {session?.user?.roles.includes("admin") && (
        <DeleteQuestionButton questionId={questionId} />
      )}
    </div>
  );
};

export default Question;
