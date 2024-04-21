import React from "react";
import Image from "next/image";
import Link from "next/link";

const KeyChain = ({ keyChain, user }) => (
  <div>
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-800">Keychain</h2>
      <Link
        href={`/user/${user.username}/keychain`}
        className="text-indigo-600 hover:underline"
      >
        Manage
      </Link>
    </div>
    <p className="text-gray-700 flex items-center">
      Circle Keys: {keyChain.circleKeys}
      <Image
        src="/CircleKey.png"
        alt="Circle Key"
        width={28}
        height={28}
        className="ml-2"
      />
    </p>
    <p className="text-gray-700 flex items-center mt-2">
      Star Keys: {keyChain.starKeys}
      <Image
        src="/StarKey.png"
        alt="Star Key"
        width={28}
        height={28}
        className="ml-2"
      />
    </p>
  </div>
);

export default KeyChain;
