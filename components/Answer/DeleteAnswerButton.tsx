"use client";
import React from "react";
import { db } from "@/lib/db";

const DeleteAnswerButton = ({ answerId }) => {
  return (
    <div>
      <button onClick={() => db.answer.delete({ where: { id: answerId } })}>
        Delete
      </button>
    </div>
  );
};

export default DeleteAnswerButton;
