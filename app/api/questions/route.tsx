// pages/api/questions.js

import { db } from "@/lib/db"; // Assuming you have a db utility for database connection

export async function POST(req: Request) {
  const body = await req.json();

  // const { title, content, subredditId } = PostValidator.parse(body)

  const { title, content, authorId } = body;

  // Validate data...

  try {
    const result = await db.question.create({
      data: { title, content, authorId },
    });
    return new Response("OK");
  } catch (error) {
    console.error(error);
    return new Response("OK");
  }
}

export const GET = async (req, res) => {
  try {
    const result = await db.question.findMany();
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const PUT = async (req, res) => {
  const questionId = parseInt(req.query.id);
  const { title, content } = req.body;

  // Validate data and ensure the question exists...

  try {
    const updatedQuestion = await db.question.update({
      // ... rest of the code
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// export default async function handler(req, res) {
//   if (req.method === "GET") {
//     try {
//       const result = await db.question.findMany();
//       res.status(200).json(result.rows);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }
//   if (req.method === "POST") {
//     try {
//       const body = req.body;
//       const { title, content, authorId } = body;
//       await db.question.create({
//         data: {
//           title,
//           content,
//           authorId,
//         },
//       });
//       res.status(201).json({ message: "Question created successfully" });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }
//   if (req.method === "PUT") {
//     const questionId = parseInt(req.query.id);
//     const { title, content } = req.body;

//     // Validate data and ensure the question exists...

//     try {
//       const updatedQuestion = await db.question.update({
//         where: {
//           id: questionId,
//         },
//         data: {
//           title,
//           content,
//         },
//       });
//       res.status(200).json(updatedQuestion);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { title, content, authorId } = body;
//     console.log("title", body);
//     await db.question.create({
//       data: {
//         title,
//         content,
//         authorId,
//       },
//     });
//     return new Response("OK");
//   } catch (error) {
//     return new Response("Error", { status: 500 });
//   }
// }

// export const GET = async (req, res) => {
//   try {
//     const result = await db.question.findMany();
//     res.status(200).json(result.rows);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const PUT = async (req, res) => {
//   const questionId = parseInt(req.query.id);
//   const { title, content } = req.body;

//   // Validate data and ensure the question exists...

//   try {
//     const updatedQuestion = await db.question.update({
//       // ... rest of the code
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
