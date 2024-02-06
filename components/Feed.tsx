import { db } from "@/lib/db";
import QuestionList from "./QuestionList";

export default async function Feed() {
  const questions = await db.question.findMany();

  return (
    <div>
      <h1>Question and Answer Forum</h1>
      <QuestionList questions={questions} />
    </div>
  );
}
