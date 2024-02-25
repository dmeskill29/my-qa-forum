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
import UpVoteButton from "@/components/UpVoteButton";
import DownVoteButton from "@/components/DownVoteButton";
import Answer from "@/components/Answer";
import CloseQuestionButton from "@/components/CloseQuestionButton";

export default async function QuestionPage({ params }) {
  const session = await getServerSession(authOptions);
  const question = await db.question.findUnique({
    where: {
      id: params.questionId,
    },
  });

  let topAnswer;

  try {
    topAnswer = await db.answer.findFirst({
      where: {
        id: question.topAnswer,
      },
    });
  } catch (error) {
    console.error("Error finding top answer:", error);
  }

  const asker = await db.user.findUnique({
    where: {
      id: question.authorId,
    },
  });

  if (question.open === false) {
    return (
      <div>
        <h1>Closed Question</h1>
        <Link href={`/user/${asker.username}`}>{asker.username}</Link>
        <Question questionId={params.questionId} />
        <QuestionUpdateList questionId={params.questionId} />
        <UpVoteButton questionId={params.questionId} />
        <DownVoteButton questionId={params.questionId} />
        <h2>Top Answer</h2>
        {topAnswer && <Answer answer={topAnswer} />}
        <AnswerList questionId={params.questionId} />
      </div>
    );
  } else {
    return (
      <div>
        <h1>Open Question</h1>
        <Link href={`/user/${asker.username}`}>{asker.username}</Link>
        <Question questionId={params.questionId} />
        <QuestionUpdateList questionId={params.questionId} />
        {session?.user?.id === asker.id && (
          <QuestionUpdate questionId={params.questionId} />
        )}
        {session?.user?.id === asker.id && (
          <CloseQuestionButton questionId={params.questionId} />
        )}
        <UpVoteButton questionId={params.questionId} />
        <DownVoteButton questionId={params.questionId} />
        <h2>Top Answer</h2>
        {topAnswer && <Answer answer={topAnswer} />}
        <CreateAnswer questionId={params.questionId} />
        <AnswerList questionId={params.questionId} />
      </div>
    );
  }
}
