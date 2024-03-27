import React from "react";
import { db } from "@/lib/db";

const ProblemUpdateList = async ({ problem }) => {
  const problemUpdates = await db.problemUpdate.findMany({
    where: { problemId: problem.id },
  });

  return (
    <div className="space-y-4">
      {problemUpdates.map((update) => (
        <div key={update.id} className="p-8 border-t border-gray-200">
          <div className="flex justify-between items-start flex-col">
            <div className="flex-1">
              <p className="text-gray-500 break-words">{update.content}</p>
            </div>
            <p className="text-sm text-gray-500 break-words flex flex-col items-end">
              {new Date(update.updatedAt).toLocaleDateString()} at{" "}
              {new Date(update.updatedAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProblemUpdateList;
