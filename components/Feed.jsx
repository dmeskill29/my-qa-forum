import { db } from "@/lib/db";
import ProblemList from "./Problem/ProblemList";

export default async function Feed({ session }) {
  const problems = await db.problem.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <ProblemList problems={problems} session={session} />
    </div>
  );
}
