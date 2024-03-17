import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  const body = await req.json();
  const { questionId, type, userId } = body;

  const existingVote = await db.questionVote.findFirst({
    where: {
      userId: userId,
      questionId: questionId,
    },
  });

  const voteValue = type === "UP" ? 1 : type === "DOWN" ? -1 : 0;

  if (existingVote) {
    // If changing the vote type, we need to adjust the voteSum accordingly
    if (existingVote.type !== type) {
      const adjustment = type === "UP" ? 2 : -2; // Adjust by 2 because we're reversing the previous vote

      await db.question.update({
        where: { id: questionId },
        data: {
          voteSum: {
            increment: adjustment,
          },
        },
      });
    }

    // Update the existing vote type only if it's changed
    if (existingVote.type !== type) {
      await db.questionVote.update({
        where: { userId_questionId: { userId, questionId } },
        data: { type },
      });
    }
  } else {
    // Create a new vote
    await db.questionVote.create({
      data: { userId, questionId, type },
    });

    // Update the question's voteSum for the new vote
    await db.question.update({
      where: { id: questionId },
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
