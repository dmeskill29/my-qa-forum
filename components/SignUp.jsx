import UserAuthForm from "@/components/UserAuthForm";
import Link from "next/link";

const SignUp = () => {
  return (
    <div className="container mx-auto flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 w-full sm:max-w-md">
      <div className="w-full bg-white rounded-lg shadow-xl overflow-hidden mt-8 md:mt-12 lg:mt-16">
        <div className="px-10 py-8">
          <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-4">
            Sign Up
          </h1>
          <p className="text-sm text-center text-gray-600 max-w-md mx-auto">
            By continuing, you are setting up a SolveCircle account and agree to
            our
            <Link href="/Terms" className="text-blue-600 hover:underline mx-1">
              Terms and Conditions
            </Link>
          </p>
        </div>
        <div className="bg-gray-50 px-10 py-6">
          <UserAuthForm />
        </div>
        <div className="bg-gray-100 px-10 py-4">
          <p className="text-sm text-center text-gray-600">
            Already own an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
