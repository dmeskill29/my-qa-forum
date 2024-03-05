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
      <h1 className="text-2xl font-bold text-gray-900">
        Question and Answer Forum
      </h1>

      <p className="text-sm text-gray-700">
        {session?.user?.roles.includes("admin")
          ? "You are an admin"
          : session?.user?.roles.includes("user")
          ? "You are a user"
          : "You are not a user"}
      </p>

      <QuestionList questions={questions} />
    </div>
  );
}
