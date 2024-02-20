import React from "react";
import { db } from "@/lib/db";
import Question from "@/components/Question";
import CreateAnswer from "@/components/CreateAnswer";
import AnswerList from "@/components/AnswerList";
import Link from "next/link";
import QuestionUpdate from "@/components/QuestionUpdate";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import QuestionUpdateList from "@/components/QuestionUpdateList";

export default async function QuestionPage({ params }) {
  const session = await getServerSession(authOptions);
  const question = await db.question.findUnique({
    where: {
      id: params.questionId,
    },
  });
  const asker = await db.user.findUnique({
    where: {
      id: question.authorId,
    },
  });

  return (
    <div>
      <Link href={`/user/${asker.username}`}>{asker.username}</Link>
      <Question questionId={params.questionId} />
      <QuestionUpdateList questionId={params.questionId} />
      {session?.user?.id === asker.id && (
        <QuestionUpdate questionId={params.questionId} />
      )}
      <CreateAnswer questionId={params.questionId} />
      <AnswerList questionId={params.questionId} />
    </div>
  );
}
