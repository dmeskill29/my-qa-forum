// pages/api/solutions.js

import { db } from "@/lib/db"; // Assuming you have a db utility for database connection

export async function POST(req) {
  const body = await req.json();

  // const { title, content, subredditId } = PostValidator.parse(body)

  const { content, authorId, problemId } = body;
  // Validate data...

  try {
    const result = await db.solution.create({
      data: { content, authorId, problemId },
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

export async function DELETE(req) {
  try {
    const { solutionId } = await req.json();
    // Delete associated votes and updates before deleting the solution
    await db.solutionVote.deleteMany({ where: { solutionId } });
    await db.solutionUpdate.deleteMany({ where: { solutionId } });

    const result = await db.solution.delete({ where: { id: solutionId } });
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
