import React from "react";
import { db } from "@/lib/db";
import Question from "@/components/Question";
import CreateAnswer from "@/components/CreateAnswer";

export default async function QuestionPage({ params }) {
  return (
    <div>
      <Question questionId={params.questionId} />
      <CreateAnswer questionId={params.questionId} />
    </div>
  );
}
