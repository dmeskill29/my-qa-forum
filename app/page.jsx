import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user?.roles.includes("user")) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4  py-4">
        <div className="space-y-4">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Find it!
                </h2>
                <p className="text-gray-600">Search for problems.</p>
              </div>
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Post it!
                </h2>
                <p className="text-gray-600">Post a problem.</p>
              </div>
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Solve it!
                </h2>
                <p className="text-gray-600">Solve a problem.</p>
              </div>
            </div>
          </div>

          <Link
            href={`/Feed`}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-150 ease-in-out text-center"
          >
            View Feed
          </Link>
        </div>
      </div>
    );
  } else {
    return (
      <div className="space-y-4">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Find it!</h2>
              <p className="text-gray-600">Search for problems.</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Post it!</h2>
              <p className="text-gray-600">Post a problem.</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
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
      </div>
    );
  }
}
