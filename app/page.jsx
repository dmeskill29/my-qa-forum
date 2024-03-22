import Feed from "../components/Feed";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if(session === null || !session.user.roles.includes("admin") ) {
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
        </div>
    );
  }

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4  py-4">
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
            className="text-white px-4 py-2 rounded transition duration-150 ease-in-out text-center"
            style={{ backgroundColor: "#307e79", hover: "brightness-50" }}
          >
            New
          </Link>

          <Link
            href="/open"
            className="text-white px-4 py-2 rounded transition duration-150 ease-in-out text-center"
            style={{ backgroundColor: "#307e79", hover: "brightness-50" }}
          >
            Open
          </Link>

          <Link
            href="/prize"
            className="text-white px-4 py-2 rounded transition duration-150 ease-in-out text-center"
            style={{ backgroundColor: "#307e79", hover: "brightness-50" }}
          >
            Prize
          </Link>
        </div>

        <Feed session={session} />
      </div>
    );
  }
}
