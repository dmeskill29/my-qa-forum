// app/api/verify-email/route.jsx

import { db } from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  try {
    // Find the user with the matching verification token
    const user = await db.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ message: "Invalid verification token" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Update the user's emailVerified field to true
    await db.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    // Redirect the user to the success page
    return new Response(null, {
      status: 302,
      headers: { Location: "/EmailVerified" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
