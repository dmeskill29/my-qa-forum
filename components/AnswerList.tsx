import { db } from "@/lib/db";
import React from "react";
import Answer from "./Answer";

const AnswerList = async ({ questionId }) => {
  const answers = await db.answer.findMany({
    where: {
      questionId: questionId,
    },
  });

  return (
    <div>
      {answers.map((answer) => (
        <Answer key={answer.id} answer={answer} />
      ))}
    </div>
  );
};

export default AnswerList;
