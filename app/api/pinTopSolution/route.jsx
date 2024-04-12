import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Resend } from "resend";

export async function PUT(req) {
  const body = await req.json();

  const { solutionId, problemId } = body;

  const problem = await db.problem.findFirst({
    where: {
      id: problemId,
    },
  });

  const session = await getServerSession(authOptions);

  if (session.user.id !== problem.authorId) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let topSolution;

  if (problem?.topSolution) {
    topSolution = await db.solution.findFirst({
      where: {
        id: problem?.topSolution,
      },
      include: {
        author: true,
      },
    });
  }

  const solution = await db.solution.findFirst({
    where: {
      id: solutionId,
    },
    include: {
      author: true,
    },
  });

  if (problem?.topSolution !== null) {
    const result = await db.problem.update({
      where: { id: problemId },
      data: { topSolution: solutionId },
    });
    // const resend = new Resend(process.env.RESEND_EMAIL_SECRET);
    // if (solution.author.emailNotified) {
    //   resend.emails.send({
    //     from: process.env.EMAIL_FROM,
    //     to: solution.author.email,
    //     subject: "Your Solution is Pinned!",
    //     html: `
    //     <p>Your solution has been pinned to the top of the problem. Check it out!</p>
    //     <p>Click <a href="https://solvecircle.app/problem/${problemId}" target="_blank">here</a> to view your solution.</p>
    //   `,
    //   });
    // }
    // if (topSolution.author.emailNotified) {
    //   resend.emails.send({
    //     from: process.env.EMAIL_FROM,
    //     to: topSolution.author.email,
    //     subject: "Your Solution is Unpinned!",
    //     html: `
    //     <p>Your solution has been unpinned from the top of the problem. Check it out!</p>
    //     <p>Click <a href="https://solvecircle.app/problem/${problemId}" target="_blank">here</a> to view your solution.</p>
    //   `,
    //   });
    // }
    return new Response(JSON.stringify({ message: "OK", result }), {
      status: 200, // HTTP status code
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    try {
      const result = await db.problem.update({
        where: { id: problemId },
        data: { topSolution: solutionId },
      });
      const resend = new Resend(process.env.RESEND_EMAIL_SECRET);
      // resend.emails.send({
      //   from: process.env.EMAIL_FROM,
      //   to: solution.author.email,
      //   subject: "Your Solution is Pinned!",
      //   html: `
      //   <p>Your solution has been pinned to the top of the problem. Check it out!</p>
      //   <p>Click <a href="https://solvecircle.app/problem/${problemId}" target="_blank">here</a> to view your solution.</p>
      // `,
      // });
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
}
