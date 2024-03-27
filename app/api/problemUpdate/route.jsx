import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  const body = await req.json();

  // const { title, content, subredditId } = PostValidator.parse(body)

  const { content, problemId, circleKeysAdded, starKeysAdded } = body;

  // Validate data...

  const problem = await db.problem.update({
    where: { id: problemId },
    data: {
      prizeInCircleKeys: { increment: circleKeysAdded },
      prizeInStarKeys: { increment: starKeysAdded },
    },
  });

  const session = await getServerSession(authOptions);

  if (session.user.id !== problem.authorId) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const user = await db.user.findUnique({
      where: { id: problem?.authorId },
    });

    const keychain = await db.keyChain.findUnique({
      where: { id: user?.keychainId ?? undefined },
    });

    if (
      (keychain?.circleKeys ?? 0) < circleKeysAdded ||
      (keychain?.starKeys ?? 0) < starKeysAdded
    ) {
      return new Response(
        JSON.stringify({
          message: "Insufficient circleKeys or star circleKeys",
        }),
        {
          status: 400, // HTTP status code
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const keychainUpdate = await db.keyChain.update({
      where: { id: user?.keychainId ?? undefined },
      data: {
        circleKeys: { decrement: circleKeysAdded },
        starKeys: { decrement: starKeysAdded },
      },
    });

    const result = await db.problemUpdate.create({
      data: { content, problemId, circleKeysAdded, starKeysAdded },
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
