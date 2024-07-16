import React from "react";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function CircleSettings({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // check if the user is an admin or creator of circle
  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  const circleName = params.circleName;

  const circle = await db.circle.findFirst({
    where: {
      name: circleName,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  const circleMembership = await db.circleMembership.findFirst({
    where: {
      circleId: circle.id,
      userId: user.id,
    },
  });
  if (!user.roles.includes("admin")) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!circle) {
    return new Response(JSON.stringify({ message: "Circle not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!circleMembership.role.includes("creator")) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 pb-2 mb-4 border-b-2 border-gray-300">
        Circle Settings
      </h1>
      <p className="mb-2">
        <span className="font-semibold">Circle Name:</span> {circle.name}
      </p>
      <p className="mb-6 italic text-gray-600">
        <span className="font-semibold">Circle Description:</span>{" "}
        {circle.description || "No description available"}
      </p>

      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Members</h2>
      <ul className="space-y-3">
        {circle.members.map((member) => (
          <li
            key={member.id}
            className="bg-gray-100 rounded-lg p-3 flex items-center"
          >
            <span className="font-medium">{member.user.username}</span>
            <div className="ml-auto space-x-2">
              {member.role.map((role) => (
                <span
                  key={role}
                  className="px-2 py-1 bg-gray-200 text-gray-700 text-sm rounded"
                >
                  {role}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
