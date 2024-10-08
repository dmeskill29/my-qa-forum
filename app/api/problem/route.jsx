import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      title,
      content,
      prizeInCircleKeys,
      prizeInStarKeys,
      tags,
      duration,
      circleName,
    } = body;

    if (prizeInCircleKeys < 0 || prizeInStarKeys < 0) {
      return new Response(
        JSON.stringify({ message: "Prizes cannot be negative" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (duration <= 0 || duration > 14) {
      return new Response(
        JSON.stringify({ message: "Duration must be between 1 and 14 days" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let circle;
    if (circleName !== "N/A") {
      circle = await db.circle.findUnique({
        where: { name: circleName },
      });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userId = session.user.id;

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { keychain: true },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newPrizeInCircleKeys = prizeInCircleKeys + 25;
    const circleKeyCost = 50 + prizeInCircleKeys;
    const starKeyCost = prizeInStarKeys;

    const keychain = user.keychain;
    if (
      !keychain ||
      keychain.circleKeys < circleKeyCost ||
      keychain.starKeys < starKeyCost
    ) {
      return new Response(JSON.stringify({ message: "Insufficient funds" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = {
      title,
      content,
      authorId: userId,
      prizeInCircleKeys: newPrizeInCircleKeys,
      prizeInStarKeys,
      tags,
      duration,
    };

    if (circle) {
      data.circleId = circle.id;
    }

    const result = await db.problem.create({ data });

    await db.keyChain.update({
      where: { id: keychain.id },
      data: {
        circleKeys: { decrement: circleKeyCost },
        starKeys: { decrement: starKeyCost },
      },
    });

    await db.leaderboard.update({
      where: {
        userId_month_leaderboardId: {
          userId: userId,
          month: new Date().toISOString().slice(0, 7),
          leaderboardId: "fatCat",
        },
      },
      data: { score: { increment: newPrizeInCircleKeys + prizeInStarKeys } },
    });

    await db.leaderboard.update({
      where: {
        userId_month_leaderboardId: {
          userId: userId,
          month: new Date().toISOString().slice(0, 7),
          leaderboardId: "problemChild",
        },
      },
      data: { score: { increment: 1 } },
    });

    return new Response(JSON.stringify({ message: "OK", result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req) {
  const problems = await db.problem.findMany({
    orderBy: { createdAt: "desc" },
  });
  return new Response(JSON.stringify(problems), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(req) {
  const body = await req.json();
  const { problemId } = body;

  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const problem = await db.problem.findUnique({
    where: { id: problemId },
  });

  const userId = problem.authorId;

  if (!session.user.roles.includes("admin")) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await db.leaderboard.update({
      where: {
        userId_month_leaderboardId: {
          userId: userId,
          month: new Date().toISOString().slice(0, 7),
          leaderboardId: "fatCat",
        },
      },
      data: {
        score: {
          decrement: problem.prizeInCircleKeys + problem.prizeInStarKeys,
        },
      },
    });

    await db.leaderboard.update({
      where: {
        userId_month_leaderboardId: {
          userId: userId,
          month: new Date().toISOString().slice(0, 7),
          leaderboardId: "problemChild",
        },
      },
      data: { score: { decrement: 1 } },
    });

    await Promise.all([
      db.problemUpdate.deleteMany({ where: { problemId } }),
      db.solution.deleteMany({ where: { problemId } }),
      db.problemVote.deleteMany({ where: { problemId } }),
      db.problem.delete({ where: { id: problemId } }),
    ]);

    return new Response(JSON.stringify({ message: "OK" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
