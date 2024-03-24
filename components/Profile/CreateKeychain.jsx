"use client";
import React from "react";
import { useRouter } from "next/navigation";

const CreateWallet = ({ user }) => {
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/keychain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create keychain");
      }

      alert("Wallet created successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error creating keychain:", error);
      alert("Failed to create keychain");
    }
  };

  return <button onClick={handleSubmit}>Create KeyChain</button>;
};

export default CreateWallet;
