import { db } from "@/lib/db";

export async function PUT(req) {
  const body = await req.json();

  const { questionId } = body;

  try {
    const question = await db.question.findUnique({
      where: { id: questionId },
    });

    const topAnswer = await db.answer.findFirst({
      where: {
        id: question?.topAnswer ?? undefined,
      },
    });

    const user = await db.user.findUnique({
      where: { id: topAnswer?.authorId },
    });

    const wallet = await db.wallet.findUnique({
      where: { id: user?.walletId ?? undefined },
    });

    const walletUpdate = await db.wallet.update({
      where: { id: user?.walletId ?? undefined },
      data: {
        keys: (wallet?.keys ?? 0) + (question?.prizeInKeys ?? 0),
        starKeys: (wallet?.starKeys ?? 0) + (question?.prizeInStarKeys ?? 0),
      },
    });

    const result = await db.question.update({
      where: { id: questionId },
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
