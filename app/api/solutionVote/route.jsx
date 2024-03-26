import { db } from "@/lib/db";

export async function PATCH(req) {
  const body = await req.json();
  const { solutionId, type, userId } = body;

  const existingVote = await db.solutionVote.findFirst({
    where: { userId: userId, solutionId: solutionId },
  });

  const voteValue = type === "UP" ? 1 : type === "DOWN" ? -1 : 0;

  if (existingVote) {
    // If the user wants to remove their vote
    if (existingVote.type === type) {
      // Delete the existing vote
      await db.solutionVote.delete({
        where: { userId_solutionId: { userId, solutionId } },
      });

      // Adjust the solution's voteSum by the opposite of the previous vote value
      await db.solution.update({
        where: { id: solutionId },
        data: { voteSum: { decrement: voteValue } },
      });
    } else {
      // If changing the vote type, we need to adjust the voteSum accordingly
      const adjustment = type === "UP" ? 2 : -2;
      // Adjust by 2 because we're reversing the previous vote
      await db.solution.update({
        where: { id: solutionId },
        data: { voteSum: { increment: adjustment } },
      });

      // Update the existing vote type
      await db.solutionVote.update({
        where: { userId_solutionId: { userId, solutionId } },
        data: { type },
      });
    }
  } else {
    // Create a new vote
    await db.solutionVote.create({
      data: { userId, solutionId, type },
    });

    // Update the solution's voteSum for the new vote
    await db.solution.update({
      where: { id: solutionId },
      data: { voteSum: { increment: voteValue } },
    });
  }

  // Assuming you're using some kind of serverless function or similar, adjust the return accordingly
  return new Response(JSON.stringify({ message: "Vote updated" }), {
    status: 200, // HTTP status code
    headers: { "Content-Type": "application/json" },
  });
}
