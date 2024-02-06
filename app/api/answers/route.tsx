// pages/api/answers.js

import { db } from "@/lib/db"; // Assuming you have a db utility for database connection

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { content, questionId, authorId } = req.body;

    // Validate data...

    try {
      const newAnswer = await db.answer.create({
        data: { content, questionId, authorId },
      });
      res.status(201).json(newAnswer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Continue in pages/api/answers.js

  // ... existing code ...

  if (req.method === "GET") {
    const { questionId } = req.query;

    try {
      const answers = await db.answer.findMany({
        where: { questionId: parseInt(questionId) },
      });
      res.status(200).json(answers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Continue in pages/api/answers.js

  // ... existing code ...

  if (req.method === "PUT") {
    const { id, content } = req.body;

    // Validate data and ensure the answer exists...

    try {
      const updatedAnswer = await db.answer.update({
        where: { id: id },
        data: { content },
      });
      res.status(200).json(updatedAnswer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Continue in pages/api/answers.js

  // ... existing code ...

  if (req.method === "DELETE") {
    const { id } = req.body;

    // Ensure the answer exists...

    try {
      await db.answer.delete({
        where: { id: id },
      });
      res.status(200).json({ message: "Answer deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
