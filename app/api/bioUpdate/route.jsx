import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req) {
  const body = await req.json();

  const { bio } = body;

  const session = await getServerSession(authOptions);

  const username = session.user.username;

  try {
    const result = await db.user.update({
      where: { username: username },
      data: { bio: bio },
    });
    return new Response(JSON.stringify({ message: "OK", result }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("OK");
  }
}
