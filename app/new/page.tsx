import React from "react";
import { db } from "@/lib/db";
import QuestionList from "@/components/Question/QuestionList";
import Link from "next/link";

const page = async () => {
  const questions = await db.question.findMany({
    orderBy: { createdAt: "desc" },
  });

  const newQuestions = questions;

  return (
    <div className="space-y-4 max-w-4xl mx-auto py-8 px-4">
      <div className="mb-4">
        <Link
          href="/CreateQuestion"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-150 ease-in-out text-center"
        >
          Create Question
        </Link>
      </div>

      <div className="flex justify-center space-x-4">
        <Link
          href="/new"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-150 ease-in-out text-center"
        >
          New
        </Link>

        <Link
          href="/open"
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition duration-150 ease-in-out text-center"
        >
          Open
        </Link>

        <Link
          href="/prize"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-150 ease-in-out text-center"
        >
          Prize
        </Link>
      </div>
      <QuestionList questions={newQuestions} />
    </div>
  );
};

export default page;
