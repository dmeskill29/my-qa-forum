import UserAuthForm from "@/components/UserAuthForm";
import Link from "next/link";

const SignIn = () => {
  return (
    <div className="container mx-auto flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 w-full sm:max-w-md">
      <div className="w-full bg-white rounded-lg shadow-xl overflow-hidden mt-8 md:mt-12 lg:mt-16">
        <div className="px-10 py-8">
          <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
            Welcome Back
          </h1>
          <UserAuthForm />
        </div>
        <div className="bg-gray-50 px-10 py-4">
          <p className="text-sm text-center text-gray-600">
            New to SolveCircle?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
