// pages/api/solutions.js

import { db } from "@/lib/db"; // Assuming you have a db utility for database connection
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  const body = await req.json();

  // const { title, content, subredditId } = PostValidator.parse(body)

  const { content, problemId } = body;
  // Validate data...
  const session = await getServerSession(authOptions);
  const authorId = session.user.id;

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
  const session = await getServerSession(authOptions);
  const solutionId = req.query.solutionId;

  const solution = await db.solution.findFirst({
    where: {
      id: solutionId,
    },
  });

  if (session.user.id !== solution.authorId) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

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
