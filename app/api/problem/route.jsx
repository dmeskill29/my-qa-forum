// pages/api/problems.js

import { db } from "@/lib/db"; // Assuming you have a db utility for database connection
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      title,
      content,
      feeInCircleKeys,
      feeInStarKeys,
      prizeInCircleKeys,
      prizeInStarKeys,
      tags,
    } = body;

    const session = await getServerSession(authOptions);

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

    let circleKeyCost;

    if (feeInCircleKeys) {
      circleKeyCost = 50 + prizeInCircleKeys;
    } else {
      circleKeyCost = prizeInCircleKeys;
    }

    let starKeyCost;

    if (feeInStarKeys) {
      starKeyCost = 50 + prizeInStarKeys;
    } else {
      starKeyCost = prizeInStarKeys;
    }

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

    const result = await db.problem.create({
      data: {
        title,
        content,
        authorId: userId,
        prizeInCircleKeys,
        prizeInStarKeys,
        tags, // Assuming tags is an array and needs to be stored as a string
      },
    });

    await db.keyChain.update({
      where: { id: keychain.id },
      data: {
        circleKeys: { decrement: circleKeyCost },
        starKeys: { decrement: starKeyCost },
      },
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
    // where: { subredditId },
    // include: { author: true, subreddit: true },
    orderBy: { createdAt: "desc" },
  });
  return new Response(JSON.stringify(problems), {
    status: 200, // HTTP status code
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(req) {
  const body = await req.json();
  const { problemId } = body;

  const session = await getServerSession(authOptions);

  const problem = await db.problem.findUnique({
    where: { id: problemId },
  });

  if (session.user.id !== problem.authorId) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await Promise.all([
      db.solution.deleteMany({ where: { problemId } }),
      db.problemVote.deleteMany({ where: { problemId } }),
      db.problemUpdate.deleteMany({ where: { problemId } }),
      db.problem.delete({ where: { id: problemId } }),
    ]);
    return new Response(JSON.stringify({ message: "OK" }), {
      status: 200, // HTTP status code
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("OK");
  }
}
