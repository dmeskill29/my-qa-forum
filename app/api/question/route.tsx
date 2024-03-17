// pages/api/questions.js

import { db } from "@/lib/db"; // Assuming you have a db utility for database connection

export async function POST(req: Request) {
  const body = await req.json();

  // const { title, content, subredditId } = PostValidator.parse(body)

  const { title, content, authorId, prize, tags } = body;

  // Validate data...

  try {
    const result = await db.question.create({
      data: { title, content, authorId, prize, tags },
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

export async function GET(req: Request) {
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

export async function DELETE(req: Request) {
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
