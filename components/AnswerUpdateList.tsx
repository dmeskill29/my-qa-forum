import React from "react";
import { db } from "@/lib/db";

const AnswerUpdateList = async ({ answerId }) => {
  const answerUpdates = await db.AnswerUpdate.findMany({
    where: {
      answerId,
    },
  });

  return (
    <div>
      {answerUpdates.map((update) => (
        <div key={update.id}>{update.text}</div>
      ))}
    </div>
  );
};

export default AnswerUpdateList;
