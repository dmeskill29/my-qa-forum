import React from "react";
import { db } from "@/lib/db";

const Question = async ({ questionId }) => {
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
      <p>By {username}</p>
      <p>At {createdAt}</p>
      <p>{question.content}</p>
    </div>
  );
};

export default Question;
