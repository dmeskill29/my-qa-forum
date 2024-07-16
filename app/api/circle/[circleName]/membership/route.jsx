import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { circleName } = params;

  try {
    const circle = await db.circle.findUnique({
      where: { name: circleName },
    });

    if (!circle) {
      return new Response(JSON.stringify({ message: "Circle not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const circleMembership = await db.circleMembership.findFirst({
      where: { circleId: circle.id, userId: session.user.id },
    });

    if (!circleMembership) {
      return new Response(JSON.stringify({ message: "Not a member" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(circleMembership), {
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
