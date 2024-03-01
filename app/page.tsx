import Feed from "../components/Feed";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div>
        <h1>Home</h1>
        <p>You need to be logged in to see the feed</p>
        <Link href="/api/auth/signin">Login</Link>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Home</h1>
        <Link href="/CreateQuestion">Create Question</Link>
        <Feed />
      </div>
    );
  }
}
