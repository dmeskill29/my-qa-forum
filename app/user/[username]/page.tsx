import React from "react";
import { db } from "@/lib/db";
import Link from "next/link";
import UsernameUpdate from "@/components/UsernameUpdate";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const ProfilePage = async ({ params }) => {
  const session = await getServerSession(authOptions);

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
    <div className="container mx-auto px-4 py-8">
      {session?.user?.id === user.id && <UsernameUpdate session={session} />}

      {/* Questions Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Questions by {user.username}
        </h1>
        <div className="space-y-6">
          {questions.map((question) => (
            <Link
              href={`/question/${question.id}`}
              key={question.id}
              className="block p-4 bg-white shadow rounded-lg hover:shadow-md transition-shadow duration-200 ease-in-out"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                {question.title}
              </h2>
              <p className="mt-2 text-gray-600">
                Posted at {new Date(question.createdAt).toLocaleString()}
              </p>
              <p className="mt-1 text-gray-700">{question.content}</p>
              <p className="mt-2 text-sm text-blue-500">
                Prize: {question.prize}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Answers Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Answers by {user.username}
        </h1>
        <div className="space-y-4">
          {answers.map((answer) => (
            <Link
              href={`/question/${answer.questionId}`}
              key={answer.id}
              className="block p-4 bg-white shadow rounded-lg hover:shadow-md transition-shadow duration-200 ease-in-out"
            >
              <p className="text-gray-700">{answer.content}</p>
              <p className="mt-2 text-sm text-gray-600">
                Answered at {new Date(answer.createdAt).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
