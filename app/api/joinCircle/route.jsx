import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const { circleId, userId } = body;

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const circleMembership = await db.circleMembership.findFirst({
      where: { circleId, userId },
    });

    if (circleMembership) {
      return new Response(
        JSON.stringify({ message: "User is already a member of this circle" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const publicGroups = await db.group.findMany({
      where: { circleId, public: true },
    });

    const newCircleMembership = await db.circleMembership.create({
      data: {
        circleId,
        userId,
        groupNotifications: publicGroups.map((group) => group.id),
      },
    });

    return new Response(
      JSON.stringify({ message: "OK", newCircleMembership }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { circleId, userId } = body;

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await db.circle.update({
      where: { id: circleId },
      data: {
        members: {
          disconnect: { id: userId },
        },
      },
    });

    return new Response(JSON.stringify({ message: "OK", result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
