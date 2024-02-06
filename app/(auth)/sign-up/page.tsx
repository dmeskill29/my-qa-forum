import SignUp from "@/components/SignUp";
import Link from "next/link";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div>
      <div>
        <Link href="/">Home</Link>

        <SignUp />
      </div>
    </div>
  );
};

export default page;
