import { db } from "@/lib/db";
import Link from "next/link";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const Circles = async () => {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.roles.includes("admin");
  let circles;
  let user;
  let yourCirclesMemberships;
  let yourCircles;
  let otherCircles;
  if (session) {
    user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { circleMemberships: true },
    });
    yourCirclesMemberships = user.circleMemberships.map(
      (membership) => membership.circleId
    );
    yourCircles = await db.circle.findMany({
      where: { id: { in: yourCirclesMemberships } },
    });

    yourCircles.sort();

    otherCircles = await db.circle.findMany({
      where: { id: { notIn: yourCirclesMemberships } },
    });

    otherCircles.sort();

    return (
      <div>
        <div className="bg-gray-100 p-4 flex flex-col items-center rounded-lg shadow-lg mt-4">
          <div className="flex justify-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Your Circles
            </h1>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {yourCircles.map((circle) => (
              <div
                key={circle.id}
                className="bg-white p-4 rounded-lg shadow w-full"
              >
                <h2 className="text-lg font-semibold text-gray-700 mb-2 text-center">
                  <Link
                    href={`/circle/${circle.name}`}
                    className="hover:underline"
                  >
                    {circle.name}
                  </Link>
                </h2>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-100 p-4 flex flex-col items-center rounded-lg shadow-lg mt-4">
          <div className="flex justify-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Other Circles
            </h1>
            {isAdmin && (
              <div className="mb-4 ml-2">
                <Link
                  href="/CreateCircle"
                  className="inline-flex items-center px-2 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-white hover:bg-gray-200 transition duration-150 ease-in-out"
                >
                  <svg className="w-5 h-5 " viewBox="0 0 20 20" fill="black">
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {otherCircles.map((circle) => (
              <div
                key={circle.id}
                className="bg-white p-4 rounded-lg shadow w-full"
              >
                <h2 className="text-lg font-semibold text-gray-700 mb-2 text-center">
                  <Link
                    href={`/circle/${circle.name}`}
                    className="hover:underline"
                  >
                    {circle.name}
                  </Link>
                </h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Link href="/ApplyForCircle" className="hover:underline">
            Apply for a new circle
          </Link>
        </div>
      </div>
    );
  } else {
    // display all circles
    circles = await db.circle.findMany();
    circles.sort();
    return (
      <div>
        <div className="bg-gray-100 p-4 flex flex-col items-center rounded-lg shadow-lg mt-4">
          <div className="flex justify-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Circles</h1>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {circles.map((circle) => (
              <div
                key={circle.id}
                className="bg-white p-4 rounded-lg shadow w-full"
              >
                <h2 className="text-lg font-semibold text-gray-700 mb-2 text-center">
                  <Link
                    href={`/circle/${circle.name}`}
                    className="hover:underline"
                  >
                    {circle.name}
                  </Link>
                </h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
};

export default Circles;
