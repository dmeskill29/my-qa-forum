import React from "react";
import { db } from "@/lib/db";

const QuestionUpdateList = async ({ questionId }) => {
  const questionUpdates = await db.QuestionUpdate.findMany({
    where: {
      questionId,
    },
  });

  return (
    <div>
      {questionUpdates.map((update) => (
        <div key={update.id}>{update.content}</div>
      ))}
    </div>
  );
};

export default QuestionUpdateList;
