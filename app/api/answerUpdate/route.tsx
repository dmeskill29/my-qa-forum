import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();

  // const { title, content, subredditId } = PostValidator.parse(body)

  const { text, answerId } = body;

  // Validate data...

  try {
    const result = await db.AnswerUpdate.create({
      data: { text, answerId },
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
