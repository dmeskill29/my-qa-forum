import SignIn from "@/components/SignIn";
import Link from "next/link";
import { FC } from "react";

const page: FC = () => {
  return (
    <div>
      <div>
        <Link href="/">Home</Link>

        <SignIn />
      </div>
    </div>
  );
};

export default page;
