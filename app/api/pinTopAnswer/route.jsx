import { db } from "@/lib/db";

export async function PUT(req) {
  const body = await req.json();

  const { answerId, questionId } = body;

  const question = await db.question.findFirst({
    where: {
      id: questionId,
    },
  });

  if (question?.topAnswer !== null) {
    const result = await db.question.update({
      where: { id: questionId },
      data: { topAnswer: answerId },
    });
    return new Response(JSON.stringify({ message: "OK", result }), {
      status: 200, // HTTP status code
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    try {
      const result = await db.question.update({
        where: { id: questionId },
        data: { topAnswer: answerId },
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
