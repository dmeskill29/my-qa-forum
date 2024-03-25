import { db } from "@/lib/db"; // Database connection utility
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

export async function POST(req) {
  const body = await req.json();
  const { email, password } = body;

  // Hashing the password
  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  try {
    // Starting a transaction if your DB supports it, to ensure both user and account are created
    const result = await db.$transaction(async (prisma) => {
      // First, create the user

      let user;

      if (
        email === process.env.ADMIN_EMAIL_1 ||
        email === process.env.ADMIN_EMAIL_2 ||
        email === process.env.ADMIN_EMAIL_3
      ) {
        user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            username: nanoid(10),
            roles: ["admin", "user"],
          },
        });
      } else {
        user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            username: nanoid(10),
            roles: ["user"],
          },
        });
      }

      // Then, create the account linked to the user
      const account = await prisma.account.create({
        data: {
          // Assuming you have a userId field to link account to user
          userId: user.id,
          // Add additional default data or data from `req` as needed
          type: "credentials",
          provider: "solvecircle",
        },
      });

      return { user, account }; // Return both created entities
    });

    // Respond with success message and created entities (consider what you really need to return)
    return new Response(
      JSON.stringify({ message: "User and Account Created", result }),
      {
        status: 200, // HTTP status code
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(error);
    // Respond with error message
    return new Response(
      JSON.stringify({ message: "Signup Failed", error: error.message }),
      {
        status: 500, // HTTP status code for server error
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
