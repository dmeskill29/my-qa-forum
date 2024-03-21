import { db } from "@/lib/db";

export async function PATCH(req) {
  const body = await req.json();
  const { answerId, type, userId } = body;

  const existingVote = await db.answerVote.findFirst({
    where: {
      userId: userId,
      answerId: answerId,
    },
  });

  const voteValue = type === "UP" ? 1 : type === "DOWN" ? -1 : 0;

  if (existingVote) {
    // If changing the vote type, we need to adjust the voteSum accordingly
    if (existingVote.type !== type) {
      const adjustment = type === "UP" ? 2 : -2; // Adjust by 2 because we're reversing the previous vote

      await db.answer.update({
        where: { id: answerId },
        data: {
          voteSum: {
            increment: adjustment,
          },
        },
      });
    }

    // Update the existing vote type only if it's changed
    if (existingVote.type !== type) {
      await db.answerVote.update({
        where: { userId_answerId: { userId, answerId } },
        data: { type },
      });
    }
  } else {
    // Create a new vote
    await db.answerVote.create({
      data: { userId, answerId, type },
    });

    // Update the answer's voteSum for the new vote
    await db.answer.update({
      where: { id: answerId },
      data: {
        voteSum: {
          increment: voteValue,
        },
      },
    });
  }

  // Assuming you're using some kind of serverless function or similar, adjust the return accordingly
  return new Response(JSON.stringify({ message: "Vote updated" }), {
    status: 200, // HTTP status code
    headers: {
      "Content-Type": "application/json",
    },
  });
}
