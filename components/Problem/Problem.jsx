import React from "react";
import Image from "next/image";
import moment from "moment";

const Problem = ({ problem }) => {
  const utcDate = new Date(problem.createdAt);

  const isAdminProblem = problem.author.roles.includes("admin");

  const isWebsiteProblem = problem.author.roles.includes("website");

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
    <div
      className={`max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg ${
        isWebsiteProblem
          ? "bg-yellow-50 border-4 border-blue-500"
          : isAdminProblem
          ? "border-2 border-blue-500"
          : ""
      }`}
    >
      {/* Top bar for Status and Prize */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-2">
          {" "}
          <div
            className={`uppercase tracking-wide text-sm ${
              problem.open ? "text-green-500" : "text-red-500"
            } font-semibold`}
          >
            {problem.open ? (
              <img src="/Open.png" height={30} width={30} alt="Open Problem" />
            ) : (
              <img
                src="/Closed.png"
                height={30}
                width={30}
                alt="Closed Problem"
              />
            )}
          </div>
          <div className="flex  items-center">
            <ProfileImage username={problem.author.username} />
            <span className="ml-2">{problem.author.username}</span>
          </div>
        </div>
        {/* Wrap the Keys and Star Keys in a div and use flex-col for vertical stacking */}
        <div className="flex justify-center items-end">
          <div className="flex items-center text-lg font-bold text-black">
            <span>{problem.prizeInCircleKeys}</span>
            <Image
              src="/CircleKey.png"
              alt="Circle Key"
              width={32}
              height={32}
              className="ml-2 mr-4"
            />
          </div>
          <div className="flex items-center text-lg font-bold text-black">
            <span>{problem.prizeInStarKeys}</span>
            <Image
              src="/StarKey.png"
              alt="Star Key"
              width={32}
              height={32}
              className="ml-2"
            />
          </div>
        </div>
      </div>

      {/* Title and Posted Date */}
      <div className=" items-center p-4 ">
        <h1 className="text-lg leading-tight font-medium text-black hover:underline break-words">
          {problem.title}
        </h1>

        <div
          dangerouslySetInnerHTML={{ __html: problem.content }}
          className="text-gray-700 break-words"
        ></div>

        <div className="text-sm text-gray-500">{moment(utcDate).fromNow()}</div>
      </div>

      {/* Bottom bar for Votes and Tags */}
      <div className="flex justify-between items-center p-4">
        <div className="text-sm text-blue-600 flex-wrap">
          {problem.tags && (
            <>
              Tags:{" "}
              {problem.tags.split(",").map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                  #{tag.trim()}
                </span>
              ))}
            </>
          )}
        </div>
        <div className="text-lg font-semibold text-black flex items-center space-x-2">
          <Image src="/Solutions.png" height={35} width={35} alt="Solutions" />
          {problem.solutions.length}
        </div>
        <div className="text-lg font-semibold text-black flex items-center space-x-2">
          <Image src="/Votes.png" height={35} width={35} alt="Up Vote" />
          {problem.voteSum}
        </div>
      </div>

      {/* Admin Delete Button, if applicable */}
      {/* {session?.user?.roles.includes("admin") && (
        <div className="text-right p-4">
          <DeleteProblemButton problemId={problem.id} />
        </div>
      )} */}
    </div>
  );
};

export default Problem;
