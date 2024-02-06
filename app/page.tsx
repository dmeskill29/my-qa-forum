import Feed from "../components/Feed";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/CreateQuestion">Create Question</Link>
      <Feed />
    </div>
  );
}
