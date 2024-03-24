import React from "react";
import { db } from "@/lib/db";
import ProblemList from "@/components/Problem/ProblemList";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const page = async () => {
  const session = await getServerSession(authOptions);
  const problems = await db.problem.findMany({
    orderBy: { createdAt: "desc" },
  });

  const openProblems = problems.filter((problem) => problem.open === true);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4  py-4">
      <div className="mb-4">
        <Link
          href="/CreateProblem"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-150 ease-in-out text-center"
        >
          Create Problem
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
      <ProblemList problems={openProblems} />
    </div>
  );
};

export default page;
