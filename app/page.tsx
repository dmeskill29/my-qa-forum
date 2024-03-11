import Feed from "../components/Feed";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="space-y-4">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Find it!</h2>
              <p className="text-gray-600">Search for questions.</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Ask it!</h2>
              <p className="text-gray-600">Ask a question.</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Answer it!
              </h2>
              <p className="text-gray-600">Answer a question.</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-4 bg-blue-100 p-4 rounded-lg shadow-md">
          You need to be signed in to create a question, answer a question,
          search for a question, or to view the feed.
        </p>
      </div>
    );
  } else {
    return (
      <div className="space-y-4 max-w-4xl mx-auto py-8 px-4">
        <div className="mb-4">
          <Link
            href="/CreateQuestion"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-150 ease-in-out text-center"
          >
            Create Question
          </Link>
        </div>

        <div className="flex justify-center space-x-4">
          <Link
            href="/new"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-150 ease-in-out text-center"
          >
            New
          </Link>

          <Link
            href="/open"
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition duration-150 ease-in-out text-center"
          >
            Open
          </Link>

          <Link
            href="/prize"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-150 ease-in-out text-center"
          >
            Prize
          </Link>
        </div>

        <Feed />
      </div>
    );
  }
}
