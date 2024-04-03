import React from "react";
import { db } from "@/lib/db";
import Link from "next/link";
import UsernameUpdate from "@/components/Profile/UsernameUpdate";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import BioUpdate from "@/components/Profile/BioUpdate";
import Image from "next/image";
import EmailToggle from "@/components/Profile/EmailToggle";

const ProfilePage = async ({ params }) => {
  const session = await getServerSession(authOptions);

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
      author: true,
    },
  });

  const solutions = await db.solution.findMany({
    where: {
      authorId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const keychainId = user?.keychainId;

  const keyChain = keychainId
    ? await db.keyChain.findUnique({
        where: {
          id: keychainId,
        },
      })
    : null;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <svg
            className="w-24 h-24 mx-auto text-indigo-500"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856C18.448 19 19 18.105 19 17V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10c0 1.105.552 2 1.062 2zM9 21h6a2 2 0 002-2v-1H7v1a2 2 0 002 2z"></path>
          </svg>
          <h1 className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            User not found
          </h1>
          <p className="mt-2 text-base text-gray-500 dark:text-gray-400 sm:text-lg">
            The user you are looking for does not exist. Please check the URL
            and try again.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Go back to the homepage<span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <svg
            className="w-24 h-24 mx-auto text-indigo-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 8a6 6 0 11-12 0 6 6 0 0112 0zM4 8a8 8 0 1016 0 8 8 0 00-16 0zM16 16a8 8 0 01-16 0v-1a3 3 0 013-3h10a3 3 0 013 3v1z"
              clipRule="evenodd"
            />
          </svg>
          <h1 className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Sign in to view profile
          </h1>
          <p className="mt-2 text-base text-gray-500 dark:text-gray-400 sm:text-lg">
            You need to sign in to view your profile. If you don&apos;t have an
            account, you can sign up for free.
          </p>
          <div className="mt-6">
            <Link
              href="/sign-in"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-indigo-700 mb-2">
          {user.username}&apos;s Profile
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center space-x-0 sm:space-x-4 mt-4 mb-4 sm:mt-0 sm:ml-4">
          <Link
            href={`/user/${user.username}/problems`}
            className="flex items-center px-4 py-2 text-lg sm:text-xl font-semibold text-gray-800 hover:text-blue-600 transition duration-150 ease-in-out hover:underline bg-gray-100 hover:bg-blue-50 rounded-lg"
          >
            Problems
          </Link>

          <Link
            href={`/user/${user.username}/solutions`}
            className="flex items-center px-4 py-2 text-lg sm:text-xl font-semibold text-gray-800 hover:text-green-600 transition duration-150 ease-in-out hover:underline bg-gray-100 hover:bg-green-50 rounded-lg mt-2 sm:mt-0"
          >
            Solutions
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-8">
        <div
          className={`bg-white shadow rounded-lg p-6 mb-4 md:mb-0 w-full md:w-96 h-96 overflow-auto ${
            isAdmin ? "border-4 border-blue-500" : ""
          }`}
        >
          {/* Username and its update button */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Username</h2>
            {session?.user?.id === user.id && (
              <UsernameUpdate session={session} />
            )}
          </div>
          <p className="mb-4 text-gray-700">{user.username}</p>

          {/* Bio and its update button */}
          <div className="flex justify-between items-center mt-4">
            <h2 className="text-xl font-semibold text-gray-800">Bio</h2>
            {session?.user?.id === user.id && <BioUpdate session={session} />}
          </div>
          <p className="text-gray-700 text-base whitespace-pre-line mt-2">
            {user.bio ? (
              user.bio
            ) : (
              <span className="text-gray-400">No bio provided.</span>
            )}
          </p>

          {/* Keychain Section */}
          {user.id === session?.user?.id && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Keychain
                </h2>
                <Link
                  href={`/user/${user.username}/keychain`}
                  className="text-blue-600 hover:underline"
                >
                  Manage
                </Link>
              </div>
              <div>
                <p className="text-gray-700 flex items-center">
                  Circle Keys: {keyChain.circleKeys}
                  <span className="inline-flex ml-2">
                    <Image
                      src="/CircleKey.png"
                      alt="Circle Key"
                      width={28}
                      height={28}
                    />
                  </span>
                </p>
                <p className="text-gray-700 flex items-center mt-2">
                  Star Keys: {keyChain.starKeys}
                  <span className="inline-flex ml-2">
                    <Image
                      src="/StarKey.png"
                      alt="Star Key"
                      width={28}
                      height={28}
                    />
                  </span>
                </p>
              </div>
            </div>
          )}
          {user.id === session?.user?.id && (
            <EmailToggle emailNotified={user.emailNotified} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
