import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();

  // const { title, content, subredditId } = PostValidator.parse(body)

  const { content, questionId, keysAdded, starKeysAdded } = body;

  // Validate data...

  try {
    const question = await db.question.update({
      where: { id: questionId },
      data: {
        prizeInKeys: { increment: keysAdded },
        prizeInStarKeys: { increment: starKeysAdded },
      },
    });

    const user = await db.user.findUnique({
      where: { id: question?.authorId },
    });

    const wallet = await db.wallet.findUnique({
      where: { id: user?.walletId },
    });

    if (wallet?.keys < keysAdded || wallet?.starKeys < starKeysAdded) {
      return new Response(
        JSON.stringify({ message: "Insufficient keys or star keys" }),
        {
          status: 400, // HTTP status code
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const wallet = await db.wallet.update({
      where: { id: user?.walletId },
      data: {
        keys: { decrement: keysAdded },
        starKeys: { decrement: starKeysAdded },
      },
    });

    const result = await db.QuestionUpdate.create({
      data: { content, questionId, keysAdded, starKeysAdded },
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
