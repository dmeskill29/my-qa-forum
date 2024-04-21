// components/ProblemList.tsx
import Link from "next/link";
import React from "react";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import EmailToggle from "@/components/Profile/EmailToggle";

import UsernameUpdate from "@/components/Profile/UsernameUpdate";
import BioUpdate from "@/components/Profile/BioUpdate";
import Keychain from "@/components/Profile/KeyChain";
import PleaseSignIn from "@/components/PleaseSignIn";
import NoUser from "@/components/Profile/NoUser";

const PAGE_SIZE = 5; // Number of solutions per page

const page = async ({ params, searchParams }) => {
  const session = await getServerSession(authOptions);
  const page = searchParams;
  const pageNumber = page.page === undefined ? 1 : page.page;

  const user = await db.user.findUnique({
    where: {
      username: params.username,
    },
  });

  const isAdmin = user?.roles.includes("admin");

  const solutions = await db.solution.findMany({
    where: {
      authorId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      problem: true,
    },
  });

  if (!user) {
    return <NoUser />;
  }

  const keyChain = await db.keyChain.findUnique({
    where: {
      id: user.keychainId,
    },
  });

  if (!Array.isArray(solutions)) {
    console.error("solutions is not an array:", solutions);
    return <div>No solutions available</div>;
  }

  if (pageNumber < 1) {
    console.error("pageNumber must be a positive number:", pageNumber);
    return null;
  }

  // Calculate the total number of pages
  const totalPages = Math.ceil(solutions.length / PAGE_SIZE);

  // Get current page of solutions
  const start = (pageNumber - 1) * PAGE_SIZE;
  const currentSolutions = solutions.slice(start, start + PAGE_SIZE);

  if (!session) {
    return <PleaseSignIn />;
  }

  const ProfileDetail = ({ title, content, component: Component, session }) => (
    <div className="mb-4  ">
      <div className="justify-between items-center flex">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {session?.user?.id === user.id && <Component session={session} />}
      </div>
      <p
        className="text-gray-700 mb-4 break-words
      "
      >
        {content}
      </p>
    </div>
  );

  const SolutionList = ({ solutions, totalPages, pageNumber, username }) => (
    <div className="space-y-4">
      {solutions.length > 0 ? (
        solutions.map((solution) => (
          <Link
            href={`/problem/${solution.problemId}`}
            key={solution.id}
            className={`block p-4 rounded-lg bg-white hover:shadow-md border border-gray-200 
            ${
              solution.problem.topSolution === solution.id
                ? "border-yellow-500"
                : "border-gray-200"
            }`}
          >
            <h3 className="text-xl font-semibold text-indigo-700">
              Solution for: {solution.problem.title}
            </h3>
            <div
              dangerouslySetInnerHTML={{ __html: solution.content }}
              className="text-gray-700"
            ></div>
            <p className="text-sm text-gray-500">
              At {new Date(solution.createdAt).toLocaleString()}
            </p>
          </Link>
        ))
      ) : (
        <p>No solutions found.</p>
      )}
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          pageNumber={pageNumber}
          basePath={`/user/${username}/solutions`}
        />
      )}
    </div>
  );

  const Pagination = ({ totalPages, pageNumber, basePath }) => (
    <div className="flex justify-center items-center space-x-2 mt-4">
      {Array.from({ length: totalPages }).map((_, index) => (
        <Link
          key={index}
          href={`${basePath}?page=${index + 1}`}
          className={`pagination-link ${
            index + 1 === pageNumber ? "pagination-link--active font-bold" : ""
          }`}
          aria-current={index + 1 === pageNumber ? "page" : undefined}
        >
          {index + 1}
        </Link>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:space-x-8">
        <section
          className={`bg-white shadow rounded-lg p-6 mb-4 md:mb-0 w-full md:w-96 overflow-auto ${
            isAdmin ? "border-4 border-blue-500" : ""
          }`}
        >
          <h1 className="text-2xl sm:text-4xl font-extrabold text-indigo-700 mb-2">
            {user.username}&apos;s Profile
          </h1>
          <ProfileDetail
            title="Username"
            content={user.username}
            component={UsernameUpdate}
            session={session}
          />
          <ProfileDetail
            title="Bio"
            content={user.bio || "No bio provided"}
            component={BioUpdate}
            session={session}
          />
          {user.id === session?.user?.id && (
            <Keychain keyChain={keyChain} user={user} />
          )}
          {user.id === session?.user?.id && (
            <EmailToggle emailNotified={user.emailNotified} />
          )}
        </section>

        <section className="flex flex-col w-1/2 ">
          <div className="flex space-x-4 mb-4">
            <Link
              href={`/user/${user.username}/problems`}
              className="profile-link"
            >
              Problems
            </Link>
            <Link
              href={`/user/${user.username}/solutions`}
              className="profile-link"
            >
              Solutions
            </Link>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Solutions
          </h2>
          <SolutionList
            solutions={currentSolutions}
            totalPages={totalPages}
            pageNumber={pageNumber}
            username={user.username}
          />
        </section>
      </div>
    </div>
  );
};

export default page;
