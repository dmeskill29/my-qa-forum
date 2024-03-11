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
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
      <div className="p-8">
        <div
          className={`uppercase tracking-wide text-sm ${
            question.open ? "text-green-500" : "text-red-500"
          } font-semibold`}
        >
          Status: {question.open ? "Open" : "Closed"}
        </div>
        <h1 className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
          {question.title}
        </h1>
        <p className="mt-2 text-gray-500">{question.content}</p>
      </div>
      <div className="p-8 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <div className="text-lg">
              <span className="font-bold">By:</span> {username}
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-bold">At:</span> {createdAt}
            </div>
            <div className="text-sm text-blue-600">Tags: {question.tags}</div>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="text-lg font-bold">Prize: {question.prize}</div>
            <div className="text-lg font-semibold">
              Votes: {upVotes.length - downVotes.length}
            </div>
          </div>
        </div>
      </div>
      {session?.user?.roles.includes("admin") && (
        <div className="p-8 border-t border-gray-200 text-right">
          <DeleteQuestionButton questionId={questionId} />
        </div>
      )}
    </div>
  );
};

export default Question;
