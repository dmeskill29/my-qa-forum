"use client";
import React from "react";
import { db } from "@/lib/db";

const DeleteQuestionButton = ({ questionId }) => {
  return (
    <div>
      <button onClick={() => db.question.delete({ where: { id: questionId } })}>
        Delete
      </button>
    </div>
  );
};

export default DeleteQuestionButton;
