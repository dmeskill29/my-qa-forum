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

export async function DELETE(req: Request) {
  const body = await req.json();
  const { questionId } = body;
  const answers = await db.answer.findMany({
    where: { questionId },
  });
  const votes = await db.questionVote.findMany({
    where: { questionId },
  });
  const updates = await db.questionUpdate.findMany({
    where: { questionId },
  });
  try {
    const deleteAnswers = answers.map(async (answer) => {
      await db.answer.delete({ where: { id: answer.id } });
    });
    const deleteVotes = votes.map(async (vote) => {
      await db.questionVote.delete({ where: { questionId } });
    });
    const deleteUpdates = updates.map(async (update) => {
      await db.questionUpdate.delete({ where: { id: update.id } });
    });
    const result = await db.question.delete({
      where: { id: questionId },
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
