"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function JoinCircleButton({ circle }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);
  const router = useRouter();

  const handleJoinCircle = async () => {
    if (!session) {
      alert("You must be logged in to leave a circle.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/joinCircle", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          circleId: circle.id,
          userId: session.user.id,
        }),
      });

      if (response.status === 200) {
        setJoined(true);
        alert("Successfully left the circle!");
        router.refresh();
      } else {
        alert("Failed to leave the circle.");
      }
    } catch (error) {
      console.error("Error joining circle:", error);
      alert("An error occurred while trying to leave the circle.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleJoinCircle}
      disabled={loading || joined}
      className={`${
        joined ? "bg-green-500" : "bg-blue-500 hover:bg-blue-700"
      } text-white font-bold py-2 px-4 rounded-full mb-4`}
    >
      {joined ? "Left" : loading ? "Leaving..." : "Leave Circle"}
    </button>
  );
}
