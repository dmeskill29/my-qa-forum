// pages/api/questions.js

import { db } from "@/lib/db"; // Assuming you have a db utility for database connection

export async function POST(req) {
  const body = await req.json();

  // const { title, content, subredditId } = PostValidator.parse(body)

  const {
    title,
    content,
    userId,
    feeInKeys,
    feeInStarKeys,
    prizeInKeys,
    prizeInStarKeys,
    tags,
  } = body;

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { wallet: true },
  });

  const keyCost = feeInKeys + prizeInKeys;
  const starKeyCost = feeInStarKeys + prizeInStarKeys;
  console.log("keyCost", keyCost);
  console.log("starKeyCost", starKeyCost);

  const wallet = user?.wallet;

  if ((wallet?.keys ?? 0) < keyCost || (wallet?.starKeys ?? 0) < starKeyCost) {
    return new Response(JSON.stringify({ message: "Insufficient funds" }), {
      status: 400, // HTTP status code
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  // Validate data...

  try {
    const result = await db.question.create({
      data: {
        title,
        content,
        authorId: userId,
        prizeInKeys,
        prizeInStarKeys,
        tags,
      },
    });
    const postCost = await db.wallet.update({
      where: { id: wallet?.id },
      data: {
        keys: { decrement: keyCost },
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
  const questions = await db.question.findMany({
    // where: { subredditId },
    // include: { author: true, subreddit: true },
    orderBy: { createdAt: "desc" },
  });
  return new Response(JSON.stringify(questions), {
    status: 200, // HTTP status code
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(req) {
  const body = await req.json();
  const { questionId } = body;
  try {
    await Promise.all([
      db.answer.deleteMany({ where: { questionId } }),
      db.questionVote.deleteMany({ where: { questionId } }),
      db.questionUpdate.deleteMany({ where: { questionId } }),
      db.question.delete({ where: { id: questionId } }),
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
