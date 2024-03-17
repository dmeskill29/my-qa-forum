"use client";
import React from "react";
import { useRouter } from "next/navigation";

const CreateWallet = ({ user }) => {
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create wallet");
      }

      alert("Wallet created successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error creating wallet:", error);
      alert("Failed to create wallet");
    }
  };

  return <button onClick={handleSubmit}>Create KeyChain</button>;
};

export default CreateWallet;
