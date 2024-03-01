import { db } from "@/lib/db";

export async function GET(req: Request) {
  const query = req.url.split("?")[1].split("=")[1];
  console.log(query);
  const searchQuestions = async (query) => {
    const results = await db.question.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            content: {
              contains: query,
            },
          },
          {
            tags: {
              contains: query,
            },
          },
        ],
      },
    });
    return results;
  };
  try {
    const results = await searchQuestions(query);
    return new Response(JSON.stringify(results), {
      status: 200, // HTTP status code
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error");
  }
}
