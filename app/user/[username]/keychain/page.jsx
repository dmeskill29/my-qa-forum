import React from "react";
import { db } from "@/lib/db";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

const page = async ({ params }) => {
  const session = await getServerSession(authOptions);
  const user = await db.user.findUnique({
    where: {
      username: params.username,
    },
  });

  let keyChain;

  try {
    keyChain = await db.keyChain.findFirst({
      where: {
        id: user.keychainId,
      },
    });
  } catch (error) {
    console.error("Error fetching key chain:", error);
  }

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
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 14l9-5-9-5-9 5 9 5z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 14l9-5-9-5-9 5 9 5z"
            ></path>
          </svg>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            User not found
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            The user you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  if (!session || user.username !== session.user.username) {
    return (
      <p className="text-center mt-8">
        Please <Link href="/api/auth/signin">sign in</Link> to view your
        keychain.
      </p>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Wallet</h2>
        {/* Optionally, add a button or link for managing the keychain */}
      </div>
      <div>
        <div>
          <p className="text-gray-700 flex items-center">
            Balance: {keyChain.circleKeys}
            <span className="inline-flex ml-2">
              <Image
                src="/CircleKey.png"
                alt="Circle Key"
                width={28}
                height={28}
              />
            </span>
          </p>
          <p className="text-gray-700 flex items-center">
            Balance: {keyChain.starKeys}
            <span className="inline-flex ml-2">
              <Image src="/StarKey.png" alt="Star Key" width={28} height={28} />
            </span>
          </p>
        </div>
        {/* <AddStarKeysButton user={user} keyChain={keyChain} /> */}
        {/* Optionally, add more keychain-related information or actions here */}
      </div>
    </div>
  );
};

export default page;
