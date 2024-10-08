import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import FeedLinks from "@/components/FeedLinks";
import Leaderboard from "@/components/Leaderboard";
import Feed from "@/components/Feed";
import { db } from "@/lib/db";
import Intro from "@/components/Intro";
import Circles from "@/components/Circles";

const PAGE_SIZE = 10; // Number of problems per page

export default async function Home({ searchParams }) {
  const session = await getServerSession(authOptions);

  const page = searchParams;
  const pageNumber = page.page === undefined ? 1 : page.page;

  const problems = await db.problem.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      solutions: true,
      author: true, // Assuming the relation field name is `author`
      circle: true,
    },
  });

  if (!Array.isArray(problems)) {
    console.error("problems is not an array:", problems);
    return <div>No problems available</div>;
  }

  if (pageNumber < 1) {
    console.error("pageNumber must be a positive number:", pageNumber);
    return null;
  }

  // Calculate the total number of pages
  const totalPages = Math.ceil(problems.length / PAGE_SIZE);

  return (
    <div className="flex mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4  py-4  sm:w-full justify-center space-x-4">
      <div className="w-1/5 hidden sm:block">
        {" "}
        <Circles />
      </div>
      <div className="lg:w-1/2 sm:w-full">
        {" "}
        <Intro session={session} />
        <FeedLinks />
        {problems.length > 0 ? (
          <Feed
            problems={problems}
            pageNumber={pageNumber}
            totalPages={totalPages}
            pageSize={PAGE_SIZE}
            type=""
          />
        ) : null}
      </div>
      <div className="w-1/5 hidden sm:block">
        {" "}
        <Leaderboard />
      </div>
    </div>
  );
}
