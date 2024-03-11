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
        <div key={update.id} className="bg-gray-100 p-4 my-2 rounded-lg shadow">
          <p className="text-gray-800">{update.text}</p>
        </div>
      ))}
    </div>
  );
};

export default AnswerUpdateList;
