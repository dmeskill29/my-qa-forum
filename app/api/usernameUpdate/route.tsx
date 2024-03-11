import { db } from "@/lib/db";

export async function PUT(req: Request) {
  const body = await req.json();

  const { usernameNew, usernameOld } = body;

  try {
    const result = await db.user.update({
      where: { username: usernameOld },
      data: { username: usernameNew },
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
