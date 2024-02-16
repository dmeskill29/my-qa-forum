// pages/api/questions.js

import { db } from "@/lib/db"; // Assuming you have a db utility for database connection

export async function POST(req: Request) {
  const body = await req.json();

  // const { title, content, subredditId } = PostValidator.parse(body)

  const { title, content, authorId, prize } = body;

  // Validate data...

  try {
    const result = await db.question.create({
      data: { title, content, authorId, prize },
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
