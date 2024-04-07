import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  const body = await req.json();

  // const { title, content, subredditId } = PostValidator.parse(body)

  const { content, problemId, circleKeysAdded, starKeysAdded } = body;

  const MAX_PROBLEM_UPDATE_LENGTH = 1000;

  if (!content) {
    return new Response(JSON.stringify({ message: "Content is required." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (content.length > MAX_PROBLEM_UPDATE_LENGTH) {
    return new Response(
      JSON.stringify({
        message: `Problem update must be less than ${MAX_PROBLEM_UPDATE_LENGTH} characters.`,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Validate data...

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

  if (circleKeysAdded < 0 || starKeysAdded < 0) {
    return new Response(
      JSON.stringify({ message: "Prizes cannot be negative" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const problemUpdate = await db.problem.update({
    where: { id: problemId },
    data: {
      prizeInCircleKeys: { increment: circleKeysAdded },
      prizeInStarKeys: { increment: starKeysAdded },
    },
  });

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
