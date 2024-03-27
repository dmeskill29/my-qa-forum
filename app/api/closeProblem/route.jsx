import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req) {
  const body = await req.json();

  const { problemId } = body;

  const problem = await db.problem.findUnique({
    where: { id: problemId },
  });

  const session = await getServerSession(authOptions);

  if (session.user.id !== problem.authorId) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const topSolution = await db.solution.findFirst({
    where: {
      id: problem?.topSolution ?? undefined,
    },
  });

  try {
    const user = await db.user.findUnique({
      where: { id: topSolution?.authorId },
    });

    const keychain = await db.keyChain.findUnique({
      where: { id: user?.keychainId ?? undefined },
    });

    const keychainUpdate = await db.keyChain.update({
      where: { id: user?.keychainId ?? undefined },
      data: {
        circleKeys:
          (keychain?.circleKeys ?? 0) + (problem?.prizeInCircleKeys ?? 0),
        starKeys: (keychain?.starKeys ?? 0) + (problem?.prizeInStarKeys ?? 0),
      },
    });

    const result = await db.problem.update({
      where: { id: problemId },
      data: { open: false },
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
