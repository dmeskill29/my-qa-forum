import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { Resend } from "resend";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, circleName, message } = body;

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const resend = new Resend(process.env.RESEND_EMAIL_SECRET);

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_FROM,
      subject: "New Circle Application",
      html: `
        <h1>New Circle Application</h1>
        <p>You have received a new application for the circle <strong>${circleName}</strong>.</p>
        <p>User: ${user.username}</p>
        <p>Message: ${message}</p>
      `,
    });

    return new Response(JSON.stringify({ message: "OK" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
