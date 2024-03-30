import React from "react";
import { db } from "@/lib/db";

const SolutionUpdateList = async ({ solutionId }) => {
  const solutionUpdates = await db.solutionUpdate.findMany({
    where: {
      solutionId,
    },
  });

  return (
    <div className="my-4">
      {solutionUpdates.length > 0 ? (
        solutionUpdates.map((update) => (
          <div
            key={update.id}
            className="bg-white p-4 my-4 rounded-lg shadow border border-gray-200 hover:shadow-lg transition-shadow duration-300 ease-in-out"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <p className="text-gray-800 text-sm md:text-md lg:text-lg font-medium mb-2 md:mb-0">
                {update.content}
              </p>
              <p className="text-xs md:text-sm text-gray-500">
                {new Date(update.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center text-sm py-4">
          No updates available.
        </p>
      )}
    </div>
  );
};

export default SolutionUpdateList;
