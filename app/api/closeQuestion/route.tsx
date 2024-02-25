import { db } from "@/lib/db";

export async function PUT(req: Request) {
  const body = await req.json();

  const { questionId } = body;
  try {
    const result = await db.question.update({
      where: { id: questionId },
      data: { open: false },
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
