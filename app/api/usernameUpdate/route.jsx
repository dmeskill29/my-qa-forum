import { db } from "@/lib/db";

export async function PUT(req) {
  const body = await req.json();

  const { usernameNew, usernameOld } = body;

  // Check if the new username is already taken
  const existingUser = await db.user.findUnique({
    where: { username: usernameNew },
  });

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
