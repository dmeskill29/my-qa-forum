import { db } from "@/lib/db";

export async function POST(req) {
  const body = await req.json();

  // const { title, content, subredditId } = PostValidator.parse(body)

  const { user } = body;

  // Validate data...

  try {
    const result = await db.keychain.create({
      data: { user: { connect: { id: user.id } } },
    });
    const updateUser = await db.user.update({
      where: { id: user.id },
      data: { keychainId: result.id },
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
