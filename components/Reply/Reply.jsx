import React from "react";
import ReplyButton from "./ReplyButton";
import { db } from "@/lib/db";
import DeleteReplyButton from "./DeleteReplyButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const Reply = async ({ reply }) => {
  const session = await getServerSession(authOptions);
  const replies = await db.reply.findMany({
    where: {
      parentReplyId: reply.id,
    },
    include: {
      childReplies: true,
    },
  });
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="border-l-4 border-blue-500 pl-4 mb-2">
        <p className="text-gray-800">{reply.content}</p>
        <p className="text-sm text-gray-500 mt-2">
          {new Date(reply.createdAt).toLocaleDateString()} at{" "}
          {new Date(reply.createdAt).toLocaleTimeString()}
        </p>
      </div>
      <div className="ml-4 flex justify-between">
        <ReplyButton solutionId={null} replyId={reply.id} />
        {session?.user?.roles.includes("admin") && (
          <DeleteReplyButton replyId={reply.id} />
        )}
      </div>

      {replies.map((nestedReply) => (
        <Reply key={nestedReply.id} reply={nestedReply} />
      ))}
    </div>
  );
};

export default Reply;
