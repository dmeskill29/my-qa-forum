import React from "react";
import { db } from "@/lib/db";
import Link from "next/link";
import UsernameUpdate from "@/components/Profile/UsernameUpdate";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import QuestionList from "@/components/Question/QuestionList";
import BioUpdate from "@/components/Profile/BioUpdate";
import UserAnswerList from "@/components/Answer/UserAnswerList";
import CreateWallet from "@/components/Profile/CreateWallet";
import Image from "next/image";

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
    orderBy: {
      createdAt: "desc",
    },
  });

  const answers = await db.answer.findMany({
    where: {
      authorId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const walletId = user?.walletId;


  const keyChain = walletId ? await db.wallet.findUnique({
    where: {
      id: walletId,
    },
  }) :  null;

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
      <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">
        {user.username}&apos;s Profile
      </h1>

      <div className="md:flex md:flex-row justify-between md:space-x-8">
        {/* Left Column: Questions and Answers */}
        <div className="md:flex-1">
          <h2 className="text-xl font-semibold max-w-md mx-auto md:max-w-2xl text-gray-800 mb-4">
            Questions by {user.username}
          </h2>
          <QuestionList questions={questions} session={session} />

          {/* Answers Section */}
          <div className="max-w-md mx-auto rounded-xl overflow-hidden md:max-w-2xl  ">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Answers by {user.username}
            </h2>
            <UserAnswerList answers={answers} />
          </div>
        </div>

        {/* Right Column: Bio and Updates */}
        {/* This div is given negative margin-top to pull it up towards the top of the container on smaller screens. */}
        <div className="hidden md:block mt-[-11rem] md:mt-0 w-full md:w-96">
          <div className="bg-white shadow rounded-lg p-6 mb-4">
            {/* Username and its update button */}
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Username</h2>
              {session?.user?.id === user.id && (
                <UsernameUpdate session={session} />
              )}
            </div>
            <p className="mb-4 text-gray-700">{user.username}</p>

            {/* Bio and its update button */}
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Bio</h2>
              {session?.user?.id === user.id && <BioUpdate session={session} />}
            </div>
            <p className="text-gray-700 text-base whitespace-pre-line">
              {user.bio ? (
                user.bio
              ) : (
                <span className="text-gray-400">No bio provided.</span>
              )}
            </p>
          </div>
          {/* Wallet Section */}
          {user.id === session?.user?.id && (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Wallet</h2>
                {/* Optionally, add a button or link for managing the wallet */}

                <Link
                  href={`/user/${user.username}/wallet`}
                  className="text-blue-600 hover:underline"
                >
                  Manage
                </Link>
              </div>
              {keyChain ? (
                <div>
                  <p className="text-gray-700">
                    Balance: {keyChain.keys}
                    <Image
                      src="/CircleKey.png"
                      alt="Circle Key"
                      width={28}
                      height={28}
                    />
                  </p>
                  <p className="text-gray-700">
                    Balance: {keyChain.starKeys}
                    <Image
                      src="/StarKey.png"
                      alt="Star Key"
                      width={28}
                      height={28}
                    />{" "}
                  </p>
                </div>
              ) : (
                <CreateWallet user={user} />
              )}
              {/* Optionally, add more wallet-related information or actions here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
