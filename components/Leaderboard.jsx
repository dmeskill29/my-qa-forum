import { db } from "@/lib/db";
import Link from "next/link";
import React from "react";

const Leaderboard = async () => {
  const smartCookKey = [];
  const fatCat = [];
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const problems = await db.problem.findMany({
    where: { createdAt: { gte: startOfMonth, lte: endOfMonth } },
    include: {
      author: true,
    },
  });

  for (const problem of problems) {
    if (problem.topSolution !== null) {
      // Fetch the top solution for the problem
      const solution = await db.solution.findUnique({
        where: { id: problem.topSolution },
      });
      if (solution) {
        // Fetch the author of the solution
        const author = await db.user.findUnique({
          where: { id: solution.authorId },
        });
        if (author) {
          // Add the relevant information to the smartCookKey array
          smartCookKey.push({
            authorName: author.username,
            // You might want to include additional information here
          });
        }
      }
    }
    fatCat.push({
      authorName: problem.author.username,
      prize: problem.prizeInCircleKeys + problem.prizeInStarKeys,
    });
  }

  const prizeSums = fatCat.reduce((acc, curr) => {
    // Check if the authorName already exists in the accumulator object
    if (acc[curr.authorName]) {
      // If so, add the current prize to the existing sum
      acc[curr.authorName] += curr.prize;
    } else {
      // Otherwise, initialize the sum with the current prize
      acc[curr.authorName] = curr.prize;
    }
    return acc;
  }, {});

  const fatCatSummarized = Object.keys(prizeSums).map((authorName) => ({
    authorName,
    totalPrize: prizeSums[authorName],
  }));

  // Sort the fatCatSummarized array by the totalPrize in descending order
  fatCatSummarized.sort((a, b) => b.totalPrize - a.totalPrize);

  fatCatSummarized.splice(5);

  // Assuming smartCookKey is already populated with the desired data

  const usernameCounts = {};

  smartCookKey.forEach((item) => {
    const username = item.authorName;
    if (usernameCounts[username]) {
      // If the username already exists in the object, increment the count
      usernameCounts[username] += 1;
    } else {
      // If the username doesn't exist in the object, initialize it with a count of 1
      usernameCounts[username] = 1;
    }
  });

  // Sort the usernames based on the count of appearances
  const sortedUsernames = Object.keys(usernameCounts).sort(
    (a, b) => usernameCounts[b] - usernameCounts[a]
  );

  const topUsernames = sortedUsernames.slice(0, 5);

  const socialButterfly = [];
  const problemChild = [];
  const tryHard = [];

  const users = await db.user.findMany({
    include: {
      solutions: true,
      problems: true,
      replies: true,
    },
  });

  for (const user of users) {
    let userVotes = 0;
    for (const problem of user.problems) {
      const totalUpvotes = problem.voteSum;
      userVotes += totalUpvotes;
    }
    for (const solution of user.solutions) {
      const totalUpvotes = solution.voteSum;
      userVotes += totalUpvotes;
    }
    for (const reply of user.replies) {
      const totalUpvotes = reply.voteSum;
      userVotes += totalUpvotes;
    }
    socialButterfly.push({
      username: user.username,
      votes: userVotes,
    });
    problemChild.push({
      username: user.username,
      totalProblems: user.problems.length,
    });
    tryHard.push({
      username: user.username,
      totalSolutions: user.solutions.length,
    });
  }

  socialButterfly.sort((a, b) => b.votes - a.votes);
  problemChild.sort((a, b) => b.totalProblems - a.totalProblems);
  tryHard.sort((a, b) => b.totalSolutions - a.totalSolutions);

  socialButterfly.splice(5);
  problemChild.splice(5);
  tryHard.splice(5);

  return (
    <div className="bg-gray-100 p-4 flex flex-col items-center rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Leaderboard for {now.toLocaleString("default", { month: "long" })}
      </h1>
      <div className="flex flex-wrap justify-center gap-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Smart Cook-Key
          </h2>
          <div>
            {topUsernames.map((username) => (
              <div key={username} className="mt-2 text-gray-600">
                <Link href={`/user/${username}`} className="hover:underline">
                  {username}
                </Link>{" "}
                ({usernameCounts[username]})
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Fat Cat</h2>
          <div>
            {fatCatSummarized.map((author) => (
              <div key={author.authorName} className="mt-2 text-gray-600">
                <Link
                  href={`/user/${author.authorName}`}
                  className="hover:underline"
                >
                  {author.authorName}
                </Link>{" "}
                ({author.totalPrize})
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Social Butterfly
          </h2>
          <div>
            {socialButterfly.map((user) => (
              <div key={user.username} className="mt-2 text-gray-600">
                <Link
                  href={`/user/${user.username}`}
                  className="hover:underline"
                >
                  {user.username}
                </Link>{" "}
                ({user.votes})
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Problem Child
          </h2>
          <div>
            {problemChild.map((user) => (
              <div key={user.username} className="mt-2 text-gray-600">
                <Link
                  href={`/user/${user.username}`}
                  className="hover:underline"
                >
                  {user.username}
                </Link>{" "}
                ({user.totalProblems})
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Try Hard</h2>
          <div>
            {tryHard.map((user) => (
              <div key={user.username} className="mt-2 text-gray-600">
                <Link
                  href={`/user/${user.username}`}
                  className="hover:underline"
                >
                  {user.username}
                </Link>{" "}
                ({user.totalSolutions})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
