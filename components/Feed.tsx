import { db } from "@/lib/db";
import QuestionList from "./QuestionList";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Feed() {
  const session = await getServerSession(authOptions);
  const questions = await db.question.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-700">
        {session?.user?.roles.includes("admin") ? "You are an admin" : ""}
      </p>

      <QuestionList questions={questions} />
    </div>
  );
}
