import React from "react";
import { db } from "@/lib/db";
import QuestionList from "@/components/Question/QuestionList";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const page = async () => {
  const session = await getServerSession(authOptions);
  const questions = await db.question.findMany({
    orderBy: { createdAt: "desc" },
  });

  const openQuestions = questions.filter((question) => question.open === true);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return (
    <div className="space-y-4 w-1/3 mx-auto py-4">
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
          className="text-white px-4 py-2 rounded transition duration-150 ease-in-out text-center"
          style={{ backgroundColor: "#307e79", hover: "brightness-50" }}
        >
          New
        </Link>

        <Link
          href="/open"
          className="text-white px-4 py-2 rounded transition duration-150 ease-in-out text-center"
          style={{ backgroundColor: "#307e79", hover: "brightness-50" }}
        >
          Open
        </Link>

        <Link
          href="/prize"
          className="text-white px-4 py-2 rounded transition duration-150 ease-in-out text-center"
          style={{ backgroundColor: "#307e79", hover: "brightness-50" }}
        >
          Prize
        </Link>
      </div>
      <QuestionList questions={openQuestions} />
    </div>
  );
};

export default page;
