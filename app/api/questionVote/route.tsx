import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  const body = await req.json();

  const { questionId, type, userId } = body;

  const existingVote = await db.QuestionVote.findFirst({
    where: {
      userId: userId,
      questionId: questionId,
    },
  });

  if (existingVote) {
    const result = await db.QuestionVote.update({
      where: { userId_questionId: { userId, questionId } },
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
      const result = await db.QuestionVote.create({
        data: { userId, questionId, type },
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
