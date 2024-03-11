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
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Question Updates
      </h2>
      {questionUpdates.map((update) => (
        <div
          key={update.id}
          className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="p-8">
            <p className="text-gray-700">{update.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionUpdateList;
