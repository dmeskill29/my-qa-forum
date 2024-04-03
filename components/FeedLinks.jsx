import Link from "next/link";

export default async function FeedLinks() {
  return (
    <div>
      {" "}
      <div className="mb-4">
        <Link
          href="/CreateProblem"
          className="middle none center rounded-full bg-gray-800 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-800/20 transition-all hover:shadow-lg hover:shadow-gray-800/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        >
          Post a Problem
        </Link>
      </div>
      <div className="flex justify-center space-x-4">
        <Link
          href="/new"
          className="text-white px-4 py-2 rounded-full transition duration-150 ease-in-out text-center"
          style={{ backgroundColor: "#307e79", hover: "brightness-50" }}
        >
          New
        </Link>

        <Link
          href="/open"
          className="text-white px-4 py-2 rounded-full transition duration-150 ease-in-out text-center"
          style={{ backgroundColor: "#307e79", hover: "brightness-50" }}
        >
          Open
        </Link>

        <Link
          href="/prize"
          className="text-white px-4 py-2 rounded-full transition duration-150 ease-in-out text-center"
          style={{ backgroundColor: "#307e79", hover: "brightness-50" }}
        >
          Prize
        </Link>
      </div>
    </div>
  );
}
