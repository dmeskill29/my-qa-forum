import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, creatorId } = body;

    const session = await getServerSession(authOptions);

    // Check if the user is an admin
    if (!session.user.roles.includes("admin")) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if the user exists

    const user = await db.user.findUnique({
      where: { id: creatorId },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if the circle already exists

    const existingCircle = await db.circle.findFirst({
      where: { name },
    });

    if (existingCircle) {
      return new Response(
        JSON.stringify({ message: "Circle already exists" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const circle = await db.circle.create({
      data: {
        name,
        creator: { connect: { id: creatorId } },
      },
    });

    const publicGeneralGroup = await db.group.create({
      data: {
        name: "General",
        circle: { connect: { id: circle.id } },
        public: true,
      },
    });

    const privateGeneralGroup = await db.group.create({
      data: {
        name: "General",
        circle: { connect: { id: circle.id } },
        public: false,
      },
    });

    const membership = await db.circleMembership.create({
      data: {
        circle: { connect: { id: circle.id } },
        user: { connect: { id: creatorId } },
        role: ["creator", "moderator", "employee", "member"],
        groupPublicNotifications: [publicGeneralGroup.name],
        groupPrivateNotifications: [privateGeneralGroup.name],
        groupAccess: [privateGeneralGroup.name],
      },
    });

    const result = {
      circle,
      publicGeneralGroup,
      privateGeneralGroup,
      membership,
    };

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

export async function PUT(req) {
  try {
    const body = await req.json();
    const { circleId, description } = body;

    const session = await getServerSession(authOptions);

    const userMembership = await db.circleMembership.findFirst({
      where: { circleId, userId: session.user.id },
    });

    const isCreator = userMembership.role.includes("creator");

    const circle = await db.circle.findUnique({
      where: { id: circleId },
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

    await db.circle.update({
      where: { id: circleId },
      data: { description },
    });

    return new Response(JSON.stringify({ message: "OK" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req) {
  try {
    const circles = await db.circle.findMany({
      orderBy: { name: "asc" },
    });
    return new Response(JSON.stringify(circles), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
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
    const { circleId } = body;

    const session = await getServerSession(authOptions);

    const circle = await db.circle.findUnique({
      where: { id: circleId },
    });

    if (!circle) {
      return new Response(JSON.stringify({ message: "Circle not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!session.user.roles.includes("admin")) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    await db.circle.delete({ where: { id: circleId } });

    return new Response(JSON.stringify({ message: "OK" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
