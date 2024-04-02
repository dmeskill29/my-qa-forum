import React from "react";
import { db } from "@/lib/db";
import moment from "moment";

const ProblemUpdateList = async ({ problem }) => {
  const utcDate = new Date(problem.createdAt);
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
            <div className="text-sm text-gray-500">
              <div className="text-sm text-gray-500">
                {moment(utcDate).fromNow()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProblemUpdateList;
