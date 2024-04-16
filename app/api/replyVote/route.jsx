import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req) {
  const body = await req.json();
  const { replyId, type } = body;

  const session = await getServerSession(authOptions);

  const userId = session.user.id;

  const existingVote = await db.replyVote.findFirst({
    where: { userId: userId, replyId: replyId },
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
      await db.replyVote.delete({
        where: { userId_replyId: { userId, replyId } },
      });

      // Adjust the solution's voteSum by the opposite of the previous vote value
      await db.reply.update({
        where: { id: replyId },
        data: { voteSum: { decrement: voteValue } },
      });

      const leaderboardDecrement = await db.leaderboard.update({
        where: {
          userId_month_leaderboardId: {
            userId: session.user.id,
            month: new Date().toISOString().slice(0, 7),
            leaderboardId: "socialButterfly",
          },
        },
        data: { score: { decrement: voteValue } },
      });
    } else {
      // If changing the vote type, we need to adjust the voteSum accordingly
      const adjustment = type === "UP" ? 2 : -2;
      // Adjust by 2 because we're reversing the previous vote
      await db.reply.update({
        where: { id: replyId },
        data: { voteSum: { increment: adjustment } },
      });

      // Update the existing vote type
      await db.replyVote.update({
        where: { userId_replyId: { userId, replyId } },
        data: { type },
      });

      const leaderboardIncrement = await db.leaderboard.update({
        where: {
          userId_month_leaderboardId: {
            userId: session.user.id,
            month: new Date().toISOString().slice(0, 7),
            leaderboardId: "socialButterfly",
          },
        },
        data: { score: { increment: adjustment } },
      });
    }
  } else {
    // Create a new vote
    await db.replyVote.create({
      data: { userId, replyId, type },
    });

    // Update the solution's voteSum for the new vote
    await db.reply.update({
      where: { id: replyId },
      data: { voteSum: { increment: voteValue } },
    });

    const leaderboardIncrement = await db.leaderboard.update({
      where: {
        userId_month_leaderboardId: {
          userId: session.user.id,
          month: new Date().toISOString().slice(0, 7),
          leaderboardId: "socialButterfly",
        },
      },
      data: { score: { increment: voteValue } },
    });
  }

  // Assuming you're using some kind of serverless function or similar, adjust the return accordingly
  return new Response(JSON.stringify({ message: "Vote updated" }), {
    status: 200, // HTTP status code
    headers: { "Content-Type": "application/json" },
  });
}
