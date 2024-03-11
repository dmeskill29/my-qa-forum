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
    topAnswer = null;
  }

  const asker = await db.user.findUnique({
    where: {
      id: question.authorId,
    },
  });

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-4xl p-6 space-y-6">
      <div className="text-center">
        <Link
          href={`/user/${asker.username}`}
          className="text-lg text-indigo-600 hover:text-indigo-900 transition duration-300 ease-in-out font-medium"
        >
          {asker.username}
        </Link>
      </div>

      {question.open && session?.user?.id === asker.id && (
        <div className="text-right">
          <CloseQuestionButton questionId={params.questionId} />
        </div>
      )}

      <Question questionId={params.questionId} />
      <QuestionUpdateList questionId={params.questionId} />

      <div className="flex justify-center space-x-4">
        <UpVoteButton questionId={params.questionId} />
        <DownVoteButton questionId={params.questionId} />
      </div>

      <h2 className="text-xl font-semibold text-gray-800 text-center">
        Top Answer
      </h2>
      {topAnswer && <Answer answer={topAnswer} />}

      {question.open && (
        <div className="mt-4">
          <CreateAnswer questionId={params.questionId} />
        </div>
      )}

      <AnswerList questionId={params.questionId} />
    </div>
  );
}
