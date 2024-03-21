import React from "react";
import { db } from "@/lib/db";

const AnswerUpdateList = async ({ answerId }) => {
  const answerUpdates = await db.answerUpdate.findMany({
    where: {
      answerId,
    },
  });

  return (
    <div>
      {answerUpdates.length > 0 ? (
        answerUpdates.map((update) => (
          <div
            key={update.id}
            className="bg-gray-100 p-4 my-2 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 ease-in-out"
          >
            <div className="flex justify-between items-center">
              <p className="text-gray-800 text-sm md:text-base">
                {update.content}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(update.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 py-4">
          No updates available for this answer.
        </p>
      )}
    </div>
  );
};

export default AnswerUpdateList;
