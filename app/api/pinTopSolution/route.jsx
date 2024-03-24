import { db } from "@/lib/db";

export async function PUT(req) {
  const body = await req.json();

  const { solutionId, problemId } = body;

  const problem = await db.problem.findFirst({
    where: {
      id: problemId,
    },
  });

  if (problem?.topAnswer !== null) {
    const result = await db.problem.update({
      where: { id: problemId },
      data: { topAnswer: solutionId },
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
        data: { topAnswer: solutionId },
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
