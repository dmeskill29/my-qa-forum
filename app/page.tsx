import Feed from "../components/Feed";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Home</h1>
        <p className="text-sm text-gray-700">
          You need to be signed in to create a question or answer.
        </p>
        <Link
          href="/api/auth/signin"
          className="text-indigo-600 hover:text-indigo-900"
        >
          Sign in
        </Link>
      </div>
    );
  } else {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Home</h1>
        <Link
          href="/CreateQuestion"
          className="text-indigo-600 hover:text-indigo-900"
        >
          Create Question
        </Link>
        <Feed />
      </div>
    );
  }
}
