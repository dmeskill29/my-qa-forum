import { db } from "@/lib/db";
import React from "react";
import Solution from "./Solution";

const SolutionList = async ({ problemId }) => {
  const problem = await db.problem.findUnique({
    where: {
      id: problemId,
    },
  });

  const tempSolutions = await db.solution.findMany({
    where: {
      problemId: problemId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const topSolution =
    problem?.topSolution &&
    (await db.solution.findFirst({
      where: {
        id: problem?.topSolution,
      },
    }));

  let solutions;

  if (topSolution) {
    solutions = tempSolutions.filter(
      (solution) => solution.id !== topSolution.id
    );
  } else {
    solutions = tempSolutions;
  }

  return (
    <div className="space-y-4">
      {solutions.map((solution) => (
        <Solution key={solution.id} solution={solution} />
      ))}
    </div>
  );
};

export default SolutionList;
