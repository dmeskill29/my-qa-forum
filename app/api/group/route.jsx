import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, description, circleName, public: isPublic } = body;

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userMembership = await db.circleMembership.findFirst({
      where: { circle: { name: circleName }, userId: session.user.id },
    });

    const isCreator = userMembership.role.includes("creator");

    const circle = await db.circle.findUnique({
      where: { name: circleName },
    });

    if (!circle) {
      return new Response(JSON.stringify({ message: "Circle not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!isCreator || !session.user.roles.includes("admin")) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const group = await db.group.create({
      data: {
        name,
        description,
        circle: { connect: { id: circle.id } },
        public: isPublic,
      },
    });

    if (!isPublic) {
      const membershipUpdate = await db.circleMembership.update({
        where: { id: userMembership.id },
        data: {
          groupAccess: { set: [group.id, ...userMembership.groupAccess] },
          groupNotifications: {
            set: [group.id, ...userMembership.groupNotifications],
          },
        },
      });
    } else {
      const membershipUpdate = await db.circleMembership.update({
        where: { id: userMembership.id },
        data: {
          groupNotifications: {
            set: [group.id, ...userMembership.groupNotifications],
          },
        },
      });
    }

    return new Response(JSON.stringify({ message: "OK", group }), {
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
