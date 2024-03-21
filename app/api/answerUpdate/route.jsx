import { db } from "@/lib/db";

export async function POST(req) {
  const body = await req.json();

  // const { title, content, subredditId } = PostValidator.parse(body)

  const { content, answerId } = body;

  // Validate data...

  try {
    const result = await db.answerUpdate.create({
      data: { content, answerId },
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
