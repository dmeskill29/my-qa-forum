import { db } from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query || query.length < 2) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const circles = await db.circle.findMany({
      where: {
        name: { contains: query, mode: "insensitive" },
      },
      select: {
        id: true,
        name: true,
        description: true,
        members: true,
      },
      take: 10, // Limit the number of results
    });

    const sanitizedCircles = circles.map((circle) => ({
      id: circle.id,
      name: circle.name,
      description: circle.description,
      members: circle.members,
    }));

    return new Response(JSON.stringify(sanitizedCircles), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error searching users:", error);
    return new Response(JSON.stringify([]), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
