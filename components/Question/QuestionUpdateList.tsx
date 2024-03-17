import React from "react";
import { db } from "@/lib/db";

const QuestionUpdateList = async ({ question }) => {
  const questionUpdates = await db.questionUpdate.findMany({
    where: { questionId: question.id },
  });

  return (
    <div className="space-y-4">
      {questionUpdates.map((update) => (
        <div key={update.id} className="p-8 border-t border-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-gray-500 break-words">{update.content}</p>
            </div>
            <p className="text-sm text-gray-500 whitespace-nowrap">
              {new Date(update.updatedAt).toLocaleDateString()} at{" "}
              {new Date(update.updatedAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionUpdateList;
