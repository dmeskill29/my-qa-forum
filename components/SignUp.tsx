import UserAuthForm from "@/components/UserAuthForm";
import Link from "next/link";

const SignUp = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Sign Up
        </h1>
        <p className="text-sm max-w-xs mx-auto text-gray-600">
          By continuing, you are setting up a SolveSuite account and agree to
          our User Agreement and Privacy Policy.
        </p>
      </div>
      <UserAuthForm />
      <p className="px-8 text-center text-sm text-gray-500">
        Already own an account?{" "}
        <Link href="/sign-in" className="hover:text-blue-500 text-sm underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
