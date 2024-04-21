import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { Resend } from "resend";

export async function POST(req) {
  const body = await req.json();
  const { email, password } = body;

  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  try {
    const result = await db.$transaction(async (prisma) => {
      let user;
      if (email === process.env.WEBSITE_EMAIL) {
        user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            username: nanoid(10),
            roles: ["website", "admin", "user"],
            emailVerified: false, // Add emailVerified field
          },
        });
      } else if (
        email === process.env.ADMIN_EMAIL_1 ||
        email === process.env.ADMIN_EMAIL_2
      ) {
        user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            username: nanoid(10),
            roles: ["admin", "user"],
            emailVerified: false, // Add emailVerified field
          },
        });
      } else {
        user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            username: nanoid(10),
            roles: ["user"],
            emailVerified: false, // Add emailVerified field
          },
        });
      }

      const account = await prisma.account.create({
        data: {
          userId: user.id,
          type: "credentials",
          provider: "solvecircle",
        },
      });

      // Generate a unique verification token
      const verificationToken = nanoid(10);

      // Store the verification token in the user's record
      await prisma.user.update({
        where: { id: user.id },
        data: { verificationToken },
      });

      // Send the verification email using Resend
      const resend = new Resend(process.env.RESEND_EMAIL_SECRET);
      await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Verify Your Email",
        html: `
          <p>Please click the following link to verify your email:</p>
          <a href="${process.env.NEXTAUTH_URL}/api/verify-email?token=${verificationToken}">Verify Email</a>
        `,
      });

      return { user, account };
    });

    return new Response(
      JSON.stringify({
        message: "User and Account Created. Please verify your email.",
        result,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Signup Failed", error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
