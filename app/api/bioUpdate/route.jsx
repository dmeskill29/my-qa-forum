import { db } from "@/lib/db";

export async function PUT(req) {
  const body = await req.json();

  const { bio, username } = body;

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
