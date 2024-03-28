import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req) {
  const body = await req.json();

  const { usernameNew, usernameOld } = body;

  const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;

  if (!usernameRegex.test(usernameNew)) {
    return new Response(
      JSON.stringify({ message: "Invalid username format" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Check if the new username is already taken
  const existingUser = await db.user.findUnique({
    where: { username: usernameNew },
  });

  const session = await getServerSession(authOptions);

  if (session.user.username !== usernameOld) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (existingUser) {
    // If a user with the new username already exists, return an error response
    return new Response(JSON.stringify({ message: "Username already taken" }), {
      status: 400, // HTTP status code for Bad Request
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    // If the new username is not taken, proceed with updating the user's username
    const result = await db.user.update({
      where: { username: usernameOld },
      data: { username: usernameNew },
    });
    return new Response(
      JSON.stringify({ message: "Username updated successfully", result }),
      {
        status: 200, // HTTP status code for OK
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(error);
    // Return a generic error response or customize further as needed
    return new Response(
      JSON.stringify({ message: "Error updating username" }),
      {
        status: 500, // HTTP status code for Internal Server Error
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
