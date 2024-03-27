import React from "react";
import { db } from "@/lib/db";
import CreateSolution from "@/components/Solution/CreateSolution";
import SolutionList from "@/components/Solution/SolutionList";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Solution from "@/components/Solution/Solution";
import CloseProblemButton from "@/components/Problem/CloseProblemButton";
import ProblemForPage from "@/components/Problem/ProblemForPage";

export default async function ProblemPage({ params }) {
  const session = await getServerSession(authOptions);
  const problem = await db.problem.findUnique({
    where: {
      id: params.problemId,
    },
    include: {
      author: true,
    },
  });

  const topSolution =
    problem?.topSolution &&
    (await db.solution.findFirst({
      where: {
        id: problem?.topSolution,
      },
    }));

  const poster = await db.user.findUnique({
    where: {
      id: problem.authorId,
    },
  });

  if (!problem) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-4xl p-6 space-y-6">
        <div className="text-center p-6">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h1m1-4H9m5 4V9a3 3 0 00-6 0v2a3 3 0 006 0v1m5 6v-2a5 5 0 00-10 0v2m13 0a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 012-2h16a2 2 0 012 2v2z"
            />
          </svg>
          <h3 className="mt-2 text-xl font-semibold text-gray-900">
            Problem not found
          </h3>
          <p className="mt-1 text-gray-500">
            We couldn&apos;t find the problem you&apos;re looking for. Please
            check the URL or try searching for something else.
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-4xl p-6 space-y-6">
        <div className="text-center p-6">
          <svg
            className="mx-auto h-12 w-12 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 8a6 6 0 11-12 0 6 6 0 0112 0zM4 8a8 8 0 1016 0 8 8 0 00-16 0zM16 16a8 8 0 01-16 0v-1a3 3 0 013-3h10a3 3 0 013 3v1z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="mt-2 text-xl font-semibold text-gray-900">
            Please sign in
          </h3>
          <p className="mt-1 text-gray-500">
            You need to sign in to view this content. Access exclusive content
            by signing in with your account.
          </p>
          <Link
            href="/sign-in"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4  py-4">
      <div className="lg-w-1/2 mx-auto  rounded-xl overflow-hidden md:max-w-4xl p-6 space-y-4 sm:w-full">
        <div className="flex justify-between items-center p-2">
          <Link
            href={`/user/${poster.username}`}
            className="text-lg text-indigo-600 hover:text-indigo-900 transition duration-300 ease-in-out font-medium"
          >
            Posted by: {poster.username}
          </Link>

          {problem.open && session?.user?.id === poster.id && (
            <CloseProblemButton problemId={params.problemId} />
          )}
        </div>

        <ProblemForPage problem={problem} session={session} />

        <h2 className="text-xl font-semibold text-gray-800 text-center">
          Top Solution
        </h2>
        {topSolution && <Solution solution={topSolution} />}

        {problem.open && session?.user?.id !== poster?.id && (
          <CreateSolution problemId={params.problemId} />
        )}

        <SolutionList problemId={params.problemId} />
      </div>
    </div>
  );
}
