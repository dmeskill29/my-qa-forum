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
  const { solutionId } = await req.json();

  const solution = await db.solution.findFirst({
    where: {
      id: solutionId,
    },
  });

  if (!session.user.roles.includes("admin")) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Delete associated votes and updates before deleting the solution
    await Promise.all([
      db.solutionUpdate.deleteMany({ where: { solutionId } }),
      db.solutionVote.deleteMany({ where: { solutionId } }),
      db.solution.delete({ where: { id: solutionId } }),
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
