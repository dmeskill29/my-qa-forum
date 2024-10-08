import React from "react";
import ReplyButton from "./ReplyButton";
import { db } from "@/lib/db";
import DeleteReplyButton from "./DeleteReplyButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import ReplyUpVoteButton from "./ReplyUpVoteButton";
import ReplyDownVoteButton from "./ReplyDownVoteButton";
import moment from "moment";
import Image from "next/image";

const Reply = async ({ reply, problemId }) => {
  const isRelated = false;
  const isReplying = false;
  const isReplies = false;
  const session = await getServerSession(authOptions);
  const username = reply.user.username;
  const utcDate = new Date(reply.createdAt);

  let replies;

  let userVote;

  if (session) {
    userVote = await db.replyVote.findFirst({
      where: {
        replyId: reply.id,
        userId: session?.user?.id,
      },
    });
  } else {
    userVote = null;
  }

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

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200">
      <div className="flex items-center mb-2 justify-between w-full">
        <div className="flex items-center space-x-2">
          {isReplying && <span className="text-sm text-gray-500">O</span>}
          <Link
            href={`/user/${username}`}
            className="flex items-center text-blue-600 hover:text-blue-800 font-semibold transition duration-150 ease-in-out ml-16"
          >
            {reply.user.image && (
              <Image src={reply.user.image} height={30} width={30} alt="User" />
            )}
            <span className="ml-2">{username}</span>
          </Link>
        </div>
        {isRelated && <span className="text-sm text-gray-500">Related</span>}
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex flex-col items-center">
          <ReplyUpVoteButton replyId={reply.id} userVote={userVote} />
          <p className="text-lg font-semibold text-gray-900 my-1">
            {reply.voteSum}
          </p>
          <ReplyDownVoteButton replyId={reply.id} userVote={userVote} />
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: reply.content }}
          className="text-gray-800 break-words"
        ></div>
      </div>
      <div className="flex items-center space-x-4 justify-between mb-2">
        {isReplies && <span className="text-sm text-gray-500">O</span>}
        <div className="text-sm text-gray-500 ml-16">
          {moment(utcDate).fromNow()}
        </div>

        <div className="flex-col items-center space-x-2">
          {" "}
          {session?.user?.roles.includes("admin") && (
            <DeleteReplyButton replyId={reply.id} />
          )}
          <ReplyButton
            solutionId={null}
            replyId={reply.id}
            problemId={problemId}
          />
        </div>
      </div>

      {replies.map((nestedReply) => (
        <Reply key={nestedReply.id} reply={nestedReply} problemId={problemId} />
      ))}
    </div>
  );
};

export default Reply;
