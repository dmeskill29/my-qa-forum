import React from "react";
import { db } from "@/lib/db";
import Link from "next/link";

const ProfilePage = async ({ params }) => {
  const user = await db.user.findUnique({
    where: {
      username: params.username,
    },
  });

  const questions = await db.question.findMany({
    where: {
      authorId: user.id,
    },
  });

  const answers = await db.answer.findMany({
    where: {
      authorId: user.id,
    },
  });

  return (
    <div>
      <h1>Questions by {params.username}</h1>
      {questions.map((question) => (
        <Link href={`/${question.id}`} key={question.id}>
          <h1>{question.title}</h1>
          <p>At {new Date(question.createdAt).toLocaleString()}</p>
          <p>{question.content}</p>
          <p>Prize: {question.prize}</p>
        </Link>
      ))}
      <h1>Answers by {params.username}</h1>
      {answers.map((answer) => (
        <Link href={`/${answer.questionId}`} key={answer.id}>
          <p>{answer.text}</p>
          <p>At {new Date(answer.createdAt).toLocaleString()}</p>
        </Link>
      ))}
    </div>
  );
};

export default ProfilePage;
