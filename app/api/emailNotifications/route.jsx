import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req) {
  const body = await req.json();

  const { emailNotifications } = body;

  const session = await getServerSession(authOptions);

  try {
    const user = await db.user.update({
      where: { id: session.user.id },
      data: { emailNotified: emailNotifications },
    });

    return new Response(JSON.stringify({ message: "OK", user }), {
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
