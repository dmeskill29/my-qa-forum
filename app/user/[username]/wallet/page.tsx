import React from "react";
import { db } from "@/lib/db";
import CreateWallet from "@/components/Profile/CreateWallet";
import AddStarKeysButton from "@/components/Profile/AddStarKeysButton";

const page = async ({ params }) => {
  const user = await db.user.findUnique({
    where: {
      username: params.username,
    },
  });

  let keyChain;

  try {
    keyChain = await db.wallet.findFirst({
      where: {
        id: user.walletId,
      },
    });
  } catch (error) {
    console.error("Error fetching key chain:", error);
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Wallet</h2>
        {/* Optionally, add a button or link for managing the wallet */}
      </div>
      {keyChain ? (
        <div>
          <p className="text-gray-700">
            Balance: {keyChain.keys}{" "}
            <img src="/CircleKey.png" className="h-7 w-8" />
          </p>
          <p className="text-gray-700">
            Balance: {keyChain.starKeys}{" "}
            <img src="/StarKey.png" className="h-7 w-8" />
          </p>
          <AddStarKeysButton user={user} keyChain={keyChain} />
        </div>
      ) : (
        <CreateWallet user={user} />
      )}
      {/* Optionally, add more wallet-related information or actions here */}
    </div>
  );
};

export default page;
