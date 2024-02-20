import React from "react";
import { db } from "@/lib/db";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DeleteAnswerButton from "./DeleteAnswerButton";

const Answer = async ({ answer }) => {
  const session = await getServerSession(authOptions);
  const user = await db.user.findUnique({
    where: {
      id: answer.authorId,
    },
  });

  const username = user.username;
  return (
    <div>
      <p>{answer.text}</p>
      <Link href={`/user/${username}`}>{username}</Link>
      <p>At {new Date(answer.createdAt).toLocaleString()}</p>
      {session?.user?.roles.includes("admin") && (
        <DeleteAnswerButton answerId={answer.id} />
      )}
    </div>
  );
};

export default Answer;
