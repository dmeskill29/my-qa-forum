// pages/api/problems.js

import { db } from "@/lib/db"; // Assuming you have a db utility for database connection

export async function POST(req) {
  const body = await req.json();

  // const { title, content, subredditId } = PostValidator.parse(body)

  const {
    title,
    content,
    userId,
    feeInCircleKeys,
    feeInStarKeys,
    prizeInCircleKeys,
    prizeInStarKeys,
    tags,
  } = body;

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { keychain: true },
  });

  const circleKeyCost = feeInCircleKeys + prizeInCircleKeys;
  const starKeyCost = feeInStarKeys + prizeInStarKeys;
  console.log("circleKeyCost", circleKeyCost);
  console.log("starKeyCost", starKeyCost);

  const keychain = user?.keychain;

  if (
    (keychain?.circleKeys ?? 0) < circleKeyCost ||
    (keychain?.starKeys ?? 0) < starKeyCost
  ) {
    return new Response(JSON.stringify({ message: "Insufficient funds" }), {
      status: 400, // HTTP status code
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  // Validate data...

  try {
    const result = await db.problem.create({
      data: {
        title,
        content,
        authorId: userId,
        prizeInCircleKeys,
        prizeInStarKeys,
        tags,
      },
    });
    const postCost = await db.keyChain.update({
      where: { id: keychain?.id },
      data: {
        circleKeys: { decrement: circleKeyCost },
        starKeys: { decrement: starKeyCost },
      },
    });
    return new Response(JSON.stringify({ message: "OK", result }), {
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
