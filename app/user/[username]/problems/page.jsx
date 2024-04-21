// components/ProblemList.tsx
import Link from "next/link";
import React from "react";
import Problem from "@/components/Problem/Problem";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import EmailToggle from "@/components/Profile/EmailToggle";

import UsernameUpdate from "@/components/Profile/UsernameUpdate";
import BioUpdate from "@/components/Profile/BioUpdate";
import KeyChain from "@/components/Profile/KeyChain";
import PleaseSignIn from "@/components/PleaseSignIn";
import NoUser from "@/components/Profile/NoUser";

const PAGE_SIZE = 5; // Number of problems per page

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

  const problems = await db.problem.findMany({
    where: {
      authorId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      solutions: true,
      author: true,
    },
  });

  if (!user) {
    return <NoUser />;
  }

  const keyChain = await db.keyChain.findUnique({
    where: {
      id: user?.keychainId,
    },
  });

  if (!Array.isArray(problems)) {
    console.error("problems is not an array:", problems);
    return <div>No problems available</div>;
  }

  if (pageNumber < 1) {
    console.error("pageNumber must be a positive number:", pageNumber);
    return null;
  }

  // Calculate the total number of pages
  const totalPages = Math.ceil(problems.length / PAGE_SIZE);

  // Get current page of problems
  const start = (pageNumber - 1) * PAGE_SIZE;
  const currentProblems = problems.slice(start, start + PAGE_SIZE);

  const ProfileDetail = ({ title, content, session, Component }) => (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {session?.user?.id === user.id && <Component session={session} />}
      </div>
      <p className="text-gray-700 text-base mt-2 break-words">{content}</p>
    </div>
  );

  const ProblemList = ({ problems, totalPages, pageNumber, username }) => (
    <div>
      {problems.length > 0 ? (
        problems.map((problem) => (
          <Link
            href={`/problem/${problem.id}`}
            key={problem.id}
            className="block p-2 w-full"
          >
            <Problem problem={problem} />
          </Link>
        ))
      ) : (
        <p>No problems found.</p>
      )}
      {totalPages > 1 && (
        <Pagination
          links={generatePaginationLinks(totalPages, pageNumber, username)}
        />
      )}
    </div>
  );

  const generatePaginationLinks = (totalPages, pageNumber, username) =>
    Array.from({ length: totalPages }, (_, index) => ({
      pageNumber: index + 1,
      href: `/user/${username}/problems?page=${index + 1}`,
      isCurrent: index + 1 === pageNumber,
    }));

  const Pagination = ({ links }) => (
    <div className="flex justify-center items-center space-x-2 mt-4">
      {links.map((link) => (
        <Link
          href={link.href}
          key={link.pageNumber}
          className={`pagination-link ${
            link.isCurrent ? "pagination-link--active font-bold" : ""
          }`}
          aria-current={link.isCurrent ? "page" : undefined}
        >
          {link.pageNumber}
        </Link>
      ))}
    </div>
  );

  if (!session) {
    return <PleaseSignIn />;
  }
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:space-x-8">
        <div
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
            session={session}
            Component={UsernameUpdate}
          />
          <ProfileDetail
            title="Bio"
            content={user.bio || "No bio provided"}
            session={session}
            Component={BioUpdate}
          />
          {user.id === session?.user?.id && (
            <KeyChain keyChain={keyChain} user={user} />
          )}
          {user.id === session?.user?.id && (
            <EmailToggle emailNotified={user.emailNotified} />
          )}
        </div>
        <div className="flex flex-col w-1/2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
            <div className="flex space-x-4">
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
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Problems</h2>
            <ProblemList
              problems={currentProblems}
              totalPages={totalPages}
              pageNumber={pageNumber}
              username={user.username}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
