import React from "react";
import Link from "next/link";

const PleaseSignIn = () => {
  return (
    <p className="text-center mt-8">
      Please{" "}
      <Link href="/sign-in" className="text-blue-600 hover:underline">
        sign in
      </Link>{" "}
      to view the feed.
    </p>
  );
};

export default PleaseSignIn;
