// pages/api/solutions.js

import { db } from "@/lib/db"; // Assuming you have a db utility for database connection
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Resend } from "resend";

export async function POST(req) {
  const body = await req.json();

  // const { title, content, subredditId } = PostValidator.parse(body)

  const { content, solutionId, parentReplyId, problemId } = body;
  // Validate data...
  const session = await getServerSession(authOptions);
  const authorId = session.user.id;

  const MAX_REPLY_LENGTH = 1000;

  if (!content) {
    return new Response(JSON.stringify({ message: "Content is required." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (content.length > MAX_REPLY_LENGTH) {
    return new Response(
      JSON.stringify({
        message: `Reply must be less than ${MAX_REPLY_LENGTH} characters.`,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  let solution;
  let reply;
  let posterEmail;

  if (solutionId !== null && solutionId !== undefined) {
    solution = await db.solution.findFirst({
      where: {
        id: solutionId,
      },
      select: {
        authorId: true,
      },
    });
  }

  if (parentReplyId !== null && parentReplyId !== undefined) {
    reply = await db.reply.findFirst({
      where: {
        id: parentReplyId,
      },
      select: {
        authorId: true,
      },
    });
  }

  if (solution) {
    posterEmail = await db.user.findUnique({
      where: {
        id: solution.authorId,
      },
    });
  } else if (reply) {
    posterEmail = await db.user.findUnique({
      where: {
        id: reply.authorId,
      },
    });
  }

  try {
    const result = await db.reply.create({
      data: { content, authorId, solutionId, parentReplyId },
    });
    const resend = new Resend(process.env.RESEND_EMAIL_SECRET);
    if (
      solution &&
      session.user.id !== solution.authorId &&
      posterEmail.emailNotified
    ) {
      resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: posterEmail.email,
        subject: "New Reply on Your Solution!",
        html: `
        <p>Someone has replied to your solution. Check it out!</p>
        <p>Click <a href="https://solvecircle.app/problem/${problemId}" target="_blank">here</a> to view your solution.</p>
      `,
      });
    } else if (
      reply &&
      session.user.id !== reply.authorId &&
      posterEmail.emailNotified
    ) {
      resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: posterEmail.email,
        subject: "New Reply on Your Reply!",
        html: `
        <p>Someone has replied to your reply. Check it out!</p>
        <p>Click <a href="https://solvecircle.app/problem/${problemId}" target="_blank">here</a> to view your solution.</p>
      `,
      });
    }
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
  const { replyId } = await req.json();

  const reply = await db.reply.findFirst({
    where: {
      id: replyId,
    },
  });

  if (!session.user.roles.includes("admin")) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Delete associated votes and updates before deleting the solution
    await Promise.all([
      db.replyVote.deleteMany({ where: { replyId: replyId } }),
      db.reply.delete({ where: { id: replyId } }),
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
