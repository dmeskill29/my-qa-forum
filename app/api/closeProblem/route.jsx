import { db } from "@/lib/db";

export async function PUT(req) {
  const body = await req.json();

  const { problemId } = body;

  try {
    const problem = await db.problem.findUnique({
      where: { id: problemId },
    });

    const topSolution = await db.solution.findFirst({
      where: {
        id: problem?.topSolution ?? undefined,
      },
    });

    const user = await db.user.findUnique({
      where: { id: topSolution?.authorId },
    });

    const keychain = await db.keyChain.findUnique({
      where: { id: user?.keychainId ?? undefined },
    });

    const keychainUpdate = await db.keyChain.update({
      where: { id: user?.keychainId ?? undefined },
      data: {
        circleKeys: (keychain?.circleKeys ?? 0) + (problem?.prizeInCircleKeys ?? 0),
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
