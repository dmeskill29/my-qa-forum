import { db } from "@/lib/db";
import React from "react";
import Solution from "./Solution";

const SolutionList = async ({ problemId }) => {
  const solutions = await db.solution.findMany({
    where: {
      problemId: problemId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      {solutions.map((solution) => (
        <Solution key={solution.id} solution={solution} />
      ))}
    </div>
  );
};

export default SolutionList;
