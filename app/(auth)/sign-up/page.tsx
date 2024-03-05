import SignUp from "@/components/SignUp";
import Link from "next/link";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-900 flex justify-center mb-4"
        >
          Home
        </Link>

        <SignUp />
      </div>
    </div>
  );
};

export default page;
