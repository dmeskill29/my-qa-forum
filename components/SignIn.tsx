import UserAuthForm from "@/components/UserAuthForm";
import Link from "next/link";

const SignIn = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Welcome back
        </h1>
      </div>
      <UserAuthForm />
      <p className="px-8 text-center text-sm text-gray-600">
        New to SolveSuite?{" "}
        <Link href="/sign-up" className="hover:text-blue-500 text-sm underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
