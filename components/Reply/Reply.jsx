import React from "react";
import ReplyButton from "./ReplyButton";
import { db } from "@/lib/db";
import DeleteReplyButton from "./DeleteReplyButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import ReplyUpVoteButton from "./ReplyUpVoteButton";
import ReplyDownVoteButton from "./ReplyDownVoteButton";

const Reply = async ({ reply }) => {
  const isRelated = false;
  const isReplying = false;
  const isReplies = false;
  const session = await getServerSession(authOptions);
  const username = reply.user.username;

  let replies;

  try {
    replies = await db.reply.findMany({
      where: {
        parentReplyId: reply.id,
      },
      include: {
        childReplies: true,
        user: true,
      },
    });
  } catch (error) {
    console.error(error);
    replies = [];
  }

  const ProfileImage = ({ username }) => {
    const firstLetter = username.charAt(0).toUpperCase();

    return (
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          backgroundColor: "#307e79", // Your chosen color
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "20px",
        }}
      >
        {firstLetter}
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200">
      <div className="flex items-center mb-2 justify-between w-full">
        <div className="flex items-center space-x-2">
          {isReplying && <span className="text-sm text-gray-500">O</span>}
          <Link
            href={`/user/${username}`}
            className="flex items-center text-blue-600 hover:text-blue-800 font-semibold transition duration-150 ease-in-out"
          >
            <ProfileImage username={username} />
            <span className="ml-2">{username}</span>
          </Link>
        </div>
        {isRelated && <span className="text-sm text-gray-500">Related</span>}
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex flex-col items-center">
          <ReplyUpVoteButton replyId={reply.id} />
          <p className="text-lg font-semibold text-gray-900 my-1">
            {reply.voteSum}
          </p>
          <ReplyDownVoteButton replyId={reply.id} />
        </div>
        <p className="text-gray-800">{reply.content}</p>
      </div>
      <div className="flex items-center space-x-4 justify-between mb-2">
        {isReplies && <span className="text-sm text-gray-500">O</span>}
        <p className="text-sm text-gray-500 mt-2">
          {new Date(reply.createdAt).toLocaleDateString()} at{" "}
          {new Date(reply.createdAt).toLocaleTimeString()}
        </p>
        <div className="flex-col items-center space-x-2">
          {" "}
          {session?.user?.roles.includes("admin") && (
            <DeleteReplyButton replyId={reply.id} />
          )}
          <ReplyButton solutionId={null} replyId={reply.id} />
        </div>
      </div>

      {replies.map((nestedReply) => (
        <Reply key={nestedReply.id} reply={nestedReply} />
      ))}
    </div>
  );
};

export default Reply;
