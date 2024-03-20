import { db } from "@/lib/db";

export async function PUT(req: Request) {
  const body = await req.json();

  const { questionId } = body;

  try {
    const question = await db.question.findUnique({
      where: { id: questionId },
    });

    const topAnswer = await db.answer.findFirst({
      where: { id: question?.topAnswer },
    });

    const user = await db.user.findUnique({
      where: { id: topAnswer?.authorId },
    });

    const wallet = await db.wallet.update({
      where: { id: user?.walletId },
      data: {
        keys: wallet?.keys + question?.prizeInKeys,
        starKeys: wallet?.starKeys + question?.prizeInStarKeys,
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
