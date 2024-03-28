import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req) {
  const body = await req.json();
  const { problemId, type } = body;

  const session = await getServerSession(authOptions);

  const userId = session.user.id;
  const existingVote = await db.problemVote.findFirst({
    where: { userId: userId, problemId: problemId },
  });

  let voteValue = 0;

  if (type === "UP") {
    voteValue = 1;
  } else if (type === "DOWN") {
    voteValue = -1;
  } else {
    return new Response(JSON.stringify({ message: "Invalid vote type" }), {
      status: 400, // HTTP status code for Bad Request
      headers: { "Content-Type": "application/json" },
    });
  }

  if (existingVote) {
    // If the user wants to remove their vote
    if (existingVote.type === type) {
      // Delete the existing vote
      await db.problemVote.delete({
        where: { userId_problemId: { userId, problemId } },
      });

      // Adjust the problem's voteSum by the opposite of the previous vote value
      await db.problem.update({
        where: { id: problemId },
        data: { voteSum: { decrement: voteValue } },
      });
    } else {
      // If changing the vote type, we need to adjust the voteSum accordingly
      const adjustment = type === "UP" ? 2 : -2;
      // Adjust by 2 because we're reversing the previous vote
      await db.problem.update({
        where: { id: problemId },
        data: { voteSum: { increment: adjustment } },
      });

      // Update the existing vote type
      await db.problemVote.update({
        where: { userId_problemId: { userId, problemId } },
        data: { type },
      });
    }
  } else {
    // Create a new vote
    await db.problemVote.create({
      data: { userId, problemId, type },
    });

    // Update the problem's voteSum for the new vote
    await db.problem.update({
      where: { id: problemId },
      data: { voteSum: { increment: voteValue } },
    });
  }

  // Assuming you're using some kind of serverless function or similar, adjust the return accordingly
  return new Response(JSON.stringify({ message: "Vote updated" }), {
    status: 200, // HTTP status code
    headers: { "Content-Type": "application/json" },
  });
}
