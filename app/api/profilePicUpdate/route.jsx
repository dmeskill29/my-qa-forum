import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req) {
  const body = await req.json();
  const { profilePic } = body;

  const session = await getServerSession(authOptions);
  const username = session.user.username;

  try {
    const result = await db.user.update({
      where: { username: username },
      data: { image: profilePic },
    });

    return new Response(JSON.stringify({ message: "OK", result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Failed to update profile picture" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
