import React from "react";
import { db } from "@/lib/db";

const QuestionUpdateList = async ({ questionId }) => {
  const questionUpdates = await db.QuestionUpdate.findMany({
    where: {
      questionId,
    },
  });

  return (
    <div className="space-y-4">
      {questionUpdates.map((update) => (
        <div key={update.id} className="border p-4 rounded shadow">
          {update.content}
        </div>
      ))}
    </div>
  );
};

export default QuestionUpdateList;
