import { db } from "@/lib/db";
import QuestionList from "./Question/QuestionList";

export default async function Feed({ session }) {
  const questions = await db.question.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <QuestionList questions={questions} session={session} />
    </div>
  );
}
