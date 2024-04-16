// pages/api/solutions.js

import { db } from "@/lib/db"; // Assuming you have a db utility for database connection
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Resend } from "resend";

export async function POST(req) {
  const body = await req.json();

  const { content, problemId } = body;
  // Validate data...
  const session = await getServerSession(authOptions);
  const authorId = session.user.id;

  const MAX_SOLUTION_LENGTH = 1000;

  if (!content) {
    return new Response(JSON.stringify({ message: "Content is required." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (content.length > MAX_SOLUTION_LENGTH) {
    return new Response(
      JSON.stringify({
        message: `Solution must be less than ${MAX_SOLUTION_LENGTH} characters.`,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const problem = await db.problem.findFirst({
    where: {
      id: problemId,
    },
  });

  const poster = await db.user.findUnique({
    where: {
      id: problem.authorId,
    },
  });

  try {
    const result = await db.solution.create({
      data: { content, authorId, problemId },
    });

    const resend = new Resend(process.env.RESEND_EMAIL_SECRET);

    if (poster.emailNotified) {
      resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: poster.email,
        subject: "New Solution on Your Problem!",
        html: `
      <p>Someone has posted a solution to your problem. Check it out!</p>
      <p>Click <a href="https://solvecircle.app/problem/${problemId}" target="_blank">here</a> to view your solution.</p>
    `,
      });
    }

    const leaderboardIncrement = await db.leaderboard.update({
      where: {
        userId_month_leaderboardId: {
          userId: authorId,
          month: new Date().toISOString().slice(0, 7),
          leaderboardId: "tryHard",
        },
      },
      data: { score: { increment: 1 } },
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

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  const { solutionId } = await req.json();

  const solution = await db.solution.findFirst({
    where: {
      id: solutionId,
    },
  });

  if (!session.user.roles.includes("admin")) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const leaderboardDecrement = await db.leaderboard.update({
      where: {
        userId_month_leaderboardId: {
          userId: solution.authorId,
          month: new Date().toISOString().slice(0, 7),
          leaderboardId: "tryHard",
        },
      },
      data: { score: { decrement: 1 } },
    });
    // Delete associated votes and updates before deleting the solution
    await Promise.all([
      db.solutionUpdate.deleteMany({ where: { solutionId } }),
      db.solutionVote.deleteMany({ where: { solutionId } }),
      db.solution.delete({ where: { id: solutionId } }),
    ]);
    return new Response(JSON.stringify({ message: "OK" }), {
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
