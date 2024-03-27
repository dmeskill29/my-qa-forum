import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req) {
  const body = await req.json();

  const { solutionId, problemId } = body;

  const problem = await db.problem.findFirst({
    where: {
      id: problemId,
    },
  });

  const session = await getServerSession(authOptions);

  if (session.user.id !== problem.authorId) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (problem?.topSolution !== null) {
    const result = await db.problem.update({
      where: { id: problemId },
      data: { topSolution: solutionId },
    });
    return new Response(JSON.stringify({ message: "OK", result }), {
      status: 200, // HTTP status code
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    try {
      const result = await db.problem.update({
        where: { id: problemId },
        data: { topSolution: solutionId },
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
}
