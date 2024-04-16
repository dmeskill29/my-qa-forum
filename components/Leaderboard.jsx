import { db } from "@/lib/db";
import Link from "next/link";
import React from "react";

const Leaderboard = async () => {
  const currentMonth = new Date().toISOString().slice(0, 7);

  const smartCookie = await db.leaderboard.findMany({
    where: { leaderboardId: "smartCookie", month: currentMonth },
    orderBy: { score: "desc" },
    take: 5,
    include: { user: true },
  });

  const fatCat = await db.leaderboard.findMany({
    where: { leaderboardId: "fatCat", month: currentMonth },
    orderBy: { score: "desc" },
    take: 5,
    include: { user: true },
  });

  const socialButterfly = await db.leaderboard.findMany({
    where: { leaderboardId: "socialButterfly", month: currentMonth },
    orderBy: { score: "desc" },
    take: 5,
    include: { user: true },
  });

  const problemChild = await db.leaderboard.findMany({
    where: { leaderboardId: "problemChild", month: currentMonth },
    orderBy: { score: "desc" },
    take: 5,
    include: { user: true },
  });

  const tryHard = await db.leaderboard.findMany({
    where: { leaderboardId: "tryHard", month: currentMonth },
    orderBy: { score: "desc" },
    take: 5,
    include: { user: true },
  });

  return (
    <div className="bg-gray-100 p-4 flex flex-col items-center rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Leaderboard for {currentMonth}
      </h1>
      <div className="flex flex-wrap justify-center gap-8">
        <div className="bg-white p-4 rounded-lg shadow w-full">
          <h2 className="text-lg font-semibold text-gray-700 mb-2 text-center">
            Smart Cookie
          </h2>
          <div>
            {smartCookie.map((user) => (
              <div key={user.user.username} className="mt-2 text-gray-600">
                <Link
                  href={`/user/${user.user.username}`}
                  className="hover:underline"
                >
                  {user.user.username}
                </Link>{" "}
                ({user.score})
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow w-full">
          <h2 className="text-lg font-semibold text-gray-700 mb-2 text-center">
            Fat Cat
          </h2>
          <div>
            {fatCat.map((user) => (
              <div key={user.user.username} className="mt-2 text-gray-600">
                <Link
                  href={`/user/${user.user.username}`}
                  className="hover:underline"
                >
                  {user.user.username}
                </Link>{" "}
                ({user.score})
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow w-full">
          <h2 className="text-lg font-semibold text-gray-700 mb-2 text-center">
            Social Butterfly
          </h2>
          <div>
            {socialButterfly.map((user) => (
              <div key={user.user.username} className="mt-2 text-gray-600">
                <Link
                  href={`/user/${user.user.username}`}
                  className="hover:underline"
                >
                  {user.user.username}
                </Link>{" "}
                ({user.score})
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow w-full">
          <h2 className="text-lg font-semibold text-gray-700 mb-2 text-center">
            Problem Child
          </h2>
          <div>
            {problemChild.map((user) => (
              <div key={user.user.username} className="mt-2 text-gray-600">
                <Link
                  href={`/user/${user.user.username}`}
                  className="hover:underline"
                >
                  {user.user.username}
                </Link>{" "}
                ({user.score})
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow w-full">
          <h2 className="text-lg font-semibold text-gray-700 mb-2 text-center">
            Try Hard
          </h2>
          <div>
            {tryHard.map((user) => (
              <div key={user.user.username} className="mt-2 text-gray-600">
                <Link
                  href={`/user/${user.user.username}`}
                  className="hover:underline"
                >
                  {user.user.username}
                </Link>{" "}
                ({user.score})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
