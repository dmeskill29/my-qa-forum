import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  const body = await req.json();

  const { questionId, type, userId } = body;

  const existingVote = await db.QuestionVote.findFirst({
    where: {
      userId: userId,
      questionId: questionId,
    },
  });

  const voteValue = type === "UP" ? 1 : -1;

  if (existingVote) {
    // Update the existing vote
    await db.questionVote.update({
      where: { userId_questionId: { userId, questionId } },
      data: { type },
    });

    // Adjust voteSum only if the vote type is changed
    if (existingVote.type !== type) {
      await db.question.update({
        where: { id: questionId },
        data: {
          voteSum: {
            increment: voteValue,
          },
        },
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

  return new Response(JSON.stringify({ message: "Vote updated" }), {
    status: 200, // HTTP status code
    headers: {
      "Content-Type": "application/json",
    },
  });
}
