import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  const body = await req.json();

  const { answerId, type, userId } = body;

  const existingVote = await db.AnswerVote.findFirst({
    where: {
      userId: userId,
      answerId: answerId,
    },
  });

  if (existingVote) {
    const result = await db.AnswerVote.update({
      where: { userId_answerId: { userId, answerId } },
      data: { type },
    });
    return new Response(JSON.stringify({ message: "OK", result }), {
      status: 200, // HTTP status code
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    try {
      const result = await db.AnswerVote.create({
        data: { userId, answerId, type },
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
}
