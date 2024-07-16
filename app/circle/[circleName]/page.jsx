import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CircleFeedLinks from "@/components/CircleFeedLinks";
import Leaderboard from "@/components/Leaderboard";
import Feed from "@/components/Feed";
import { db } from "@/lib/db";
import Intro from "@/components/Intro";
import Circles from "@/components/Circles";
import CircleInfo from "@/components/CircleInfo";
import Groups from "@/components/Groups";
import Link from "next/link";
const PAGE_SIZE = 10; // Number of circles per page

export default async function CirclePage({ searchParams }) {
  const session = await getServerSession(authOptions);

  const page =
    searchParams.page === undefined ? 1 : parseInt(searchParams.page, 10);

  const circle = await db.circle.findFirst({
    where: { name: searchParams.circleName },
    include: { members: true, groups: true },
  });

  const circleProblems = await db.problem.findMany({
    where: { circleId: circle.id },
    include: {
      solutions: true,
      author: true,
      circle: true,
    },
  });

  if (!Array.isArray(circleProblems)) {
    console.error("circles is not an array:", circleProblems);
    return <div>No circles available</div>;
  }

  if (page < 1) {
    console.error("page must be a positive number:", page);
    return null;
  }

  // Calculate the total number of pages
  const totalPages = Math.ceil(circleProblems.length / PAGE_SIZE);

  return (
    <div>
      <div className="flex mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4 py-4 sm:w-full justify-center space-x-4">
        <div className="w-1/5 hidden sm:block">
          <CircleInfo circle={circle} session={session} />
          <Groups circle={circle} session={session} />
          <Circles />
        </div>
        <div className="lg:w-1/2 sm:w-full">
          <div className="mb-4">
            <Link
              href={`/CreateProblem/?query=${circle.name}`}
              className="middle none center rounded-full bg-gray-800 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-800/20 transition-all hover:shadow-lg hover:shadow-gray-800/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              Post
            </Link>
          </div>
          {/* <CircleFeedLinks circleName={circle.name} />
          {circleProblems.length > 0 ? (
            <Feed
              problems={circleProblems}
              pageNumber={page}
              totalPages={totalPages}
              pageSize={PAGE_SIZE}
              type="circle"
            />
          ) : null} */}
        </div>
        <div className="w-1/5 hidden sm:block">{/* <Leaderboard /> */}</div>
      </div>
    </div>
  );
}
