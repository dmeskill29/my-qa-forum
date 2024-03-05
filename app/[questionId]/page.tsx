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
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Closed Question</h1>
        <Link
          href={`/user/${asker.username}`}
          className="text-indigo-600 hover:text-indigo-900"
        >
          {asker.username}
        </Link>
        <Question questionId={params.questionId} />
        <QuestionUpdateList questionId={params.questionId} />
        <UpVoteButton questionId={params.questionId} />
        <DownVoteButton questionId={params.questionId} />
        <h2 className="text-xl font-semibold text-gray-800">Top Answer</h2>
        {topAnswer && <Answer answer={topAnswer} />}
        <AnswerList questionId={params.questionId} />
      </div>
    );
  } else {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Open Question</h1>
        <Link
          href={`/user/${asker.username}`}
          className="text-indigo-600 hover:text-indigo-900"
        >
          {asker.username}
        </Link>
        {session?.user?.id === asker.id && (
          <CloseQuestionButton questionId={params.questionId} />
        )}
        <Question questionId={params.questionId} />
        <QuestionUpdateList questionId={params.questionId} />
        {session?.user?.id === asker.id && (
          <QuestionUpdate questionId={params.questionId} />
        )}
        <UpVoteButton questionId={params.questionId} />
        <DownVoteButton questionId={params.questionId} />
        <h2 className="text-xl font-semibold text-gray-800">Top Answer</h2>
        {topAnswer && <Answer answer={topAnswer} />}
        <CreateAnswer questionId={params.questionId} />
        <AnswerList questionId={params.questionId} />
      </div>
    );
  }
}
