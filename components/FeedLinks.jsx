import Link from "next/link";

export default async function FeedLinks() {
  return (
    <div>
      {" "}
      <div className="mb-4">
        <Link
          href="/CreateProblem"
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-150 ease-in-out text-center"
        >
          Post a Problem
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
    </div>
  );
}
