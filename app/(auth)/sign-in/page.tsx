import SignIn from "@/components/SignIn";
import Link from "next/link";
import { FC } from "react";

const page: FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <SignIn />

          {/* Enhance the sign-in form appearance within the <SignIn /> component as well */}
        </div>
      </div>
    </div>
  );
};

export default page;
