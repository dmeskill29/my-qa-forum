import React from "react";
import { db } from "@/lib/db";
import CreateWallet from "@/components/Profile/CreateKeychain";
import AddStarKeysButton from "@/components/Profile/AddStarKeysButton";
import Image from "next/image";

const page = async ({ params }) => {
  const user = await db.user.findUnique({
    where: {
      username: params.username,
    },
  });

  let keyChain;

  try {
    keyChain = await db.keyChain.findFirst({
      where: {
        id: user.keychainId,
      },
    });
  } catch (error) {
    console.error("Error fetching key chain:", error);
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Wallet</h2>
        {/* Optionally, add a button or link for managing the keychain */}
      </div>
      <div>
        <div>
          <p className="text-gray-700 flex items-center">
            Balance: {keyChain.circleKeys}
            <span className="inline-flex ml-2">
              <Image
                src="/CircleKey.png"
                alt="Circle Key"
                width={28}
                height={28}
              />
            </span>
          </p>
          <p className="text-gray-700 flex items-center">
            Balance: {keyChain.starKeys}
            <span className="inline-flex ml-2">
              <Image src="/StarKey.png" alt="Star Key" width={28} height={28} />
            </span>
          </p>
        </div>
        {/* <AddStarKeysButton user={user} keyChain={keyChain} /> */}
        {/* Optionally, add more keychain-related information or actions here */}
      </div>
    </div>
  );
};

export default page;
