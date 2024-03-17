// pages/api/answers.js

import { db } from "@/lib/db"; // Assuming you have a db utility for database connection

export async function POST(req: Request) {
  const body = await req.json();

  // const { title, content, subredditId } = PostValidator.parse(body)

  const { content, authorId, questionId } = body;
  // Validate data...

  try {
    const result = await db.answer.create({
      data: { content, authorId, questionId },
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

export async function DELETE(req: Request) {
  try {
    const { answerId } = await req.json();
    // Delete associated votes and updates before deleting the answer
    await db.answerVote.deleteMany({ where: { answerId } });
    await db.answerUpdate.deleteMany({ where: { answerId } });

    const result = await db.answer.delete({ where: { id: answerId } });
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
