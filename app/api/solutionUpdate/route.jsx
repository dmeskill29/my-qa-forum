import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  const body = await req.json();

  // const { title, content, subredditId } = PostValidator.parse(body)

  const { content, solutionId } = body;

  // Validate data...
  const session = await getServerSession(authOptions);

  const solution = await db.solution.findFirst({
    where: {
      id: solutionId,
    },
  });

  if (session.user.id !== solution.authorId) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const result = await db.solutionUpdate.create({
      data: { content, solutionId },
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
