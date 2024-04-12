import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import FeedLinks from "@/components/FeedLinks";
import Leaderboard from "@/components/Leaderboard";
import FeedList from "@/components/Feed";
import { db } from "@/lib/db";

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

  if (session?.user?.roles.includes("user")) {
    return (
      <div className="flex mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4  py-4  sm:w-full justify-center space-x-4">
        {/* <div className="bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg w-1/6 hidden sm:block">
      Categories
    </div> */}
        <div className="lg:w-1/2 sm:w-full">
          {" "}
          <FeedLinks />
          {problems.length > 0 ? (
            <FeedList
              problems={problems}
              pageNumber={pageNumber}
              totalPages={totalPages}
              pageSize={PAGE_SIZE}
              type=""
            />
          ) : null}
        </div>
        <div className="w-1/6 hidden sm:block">
          {" "}
          <Leaderboard />
        </div>
      </div>
    );
  } else {
    return (
      <div className="space-y-4">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white shadow-lg rounded-full p-6 flex flex-col items-center justify-center">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Find it!</h2>
              <p className="text-gray-600">Search for a problem.</p>
            </div>
            <div className="bg-white shadow-lg rounded-full p-6 flex flex-col items-center justify-center">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Post it!</h2>
              <p className="text-gray-600">Post a problem.</p>
            </div>
            <div className="bg-white shadow-lg rounded-full p-6 flex flex-col items-center justify-center">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Solve it!
              </h2>
              <p className="text-gray-600">Solve a problem.</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-4 bg-blue-100 p-4 rounded-lg shadow-md">
          You need to be signed in to create a problem, solve a problem, search
          for a problem, or to view the feed.
        </p>
        <section className="mb-10 p-5 bg-gray-50 rounded-lg shadow">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Rules</h2>
          <p className="text-md text-gray-700">
            <strong>Hi!</strong> We are a very new website, so a lot of our
            monitoring will be by hand. If you see anything that you want to
            report, please reach out to us. By using this website, you agree to
            our{" "}
            <a href="/Terms" className="text-blue-500 hover:underline">
              Terms and Conditions
            </a>
            . You also acknowledge that a user can be removed or suspended from
            the website for any reason. These reasons include, but are not
            limited to:
          </p>
          <ul className="list-disc pl-5 mt-4 text-gray-700">
            <li>Derogatory content</li>
            <li>Hate speech or a call to violence</li>
            <li>Promotion of dangerous or illegal activity</li>
            <li>Links or directions to graphic or disturbing content</li>
          </ul>
          <p className="text-md text-gray-700 mt-4">
            Also, please keep in mind that our test user base includes members
            of all ages. Though we plan on having an 18+ toggle for future
            launches, we ask that you stay mindful of the content that you post
            during this test launch.
          </p>
        </section>
      </div>
    );
  }
}
