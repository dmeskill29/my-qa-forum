import React from "react";
import Image from "next/image";
import moment from "moment";
import exp from "constants";

const Problem = ({ problem }) => {
  const utcDate = new Date(problem.createdAt);

  const isAdminProblem = problem.author.roles.includes("admin");

  const isWebsiteProblem = problem.author.roles.includes("website");

  // Calculate the remaining time
  const expirationDate = moment(utcDate).add(problem.duration, "days");
  const timeLeft = moment(expirationDate).fromNow(true);
  const isOvertime = problem.open && moment().isAfter(expirationDate);

  const ProfileImage = ({ username }) => {
    const firstLetter = username.charAt(0).toUpperCase();

    return (
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          backgroundColor: "#307e79",
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
      className={` mx-auto bg-white rounded-xl shadow-md overflow-hidden transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg w-full 
      ${
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
          {/* Display the remaining time */}
          <div className="text-sm text-gray-500 mr-2">
            {problem.open ? (
              isOvertime ? (
                <span className="text-red-500">Overtime</span>
              ) : (
                `Time left: ${timeLeft}`
              )
            ) : (
              "Closed"
            )}
          </div>
          <div
            className={`uppercase tracking-wide text-sm ${
              problem.open ? "text-green-500" : "text-red-500"
            } font-semibold`}
          >
            {problem.open ? (
              <Image
                src="/Open.png"
                height={30}
                width={30}
                alt="Open Problem"
              />
            ) : (
              <Image
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
          className="text-gray-700 break-words line-clamp-4"
        ></div>

        <div className="text-sm text-gray-500 mt-2">
          Posted {moment(utcDate).fromNow()}
        </div>
      </div>

      <div className="text-sm text-blue-600 flex-wrap ml-4">
        {problem.tags && (
          <>
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

      {/* Bottom bar for Votes and Tags */}
      <div className="flex justify-between items-center p-4">
        <div className="text-lg font-semibold text-black flex items-center space-x-2">
          <Image src="/Solutions.png" height={35} width={35} alt="Solutions" />
          {problem.solutions.length}
        </div>
        <div className="text-lg font-semibold text-black flex items-center space-x-2">
          <Image src="/Votes.png" height={35} width={35} alt="Up Vote" />
          {problem.voteSum}
        </div>
      </div>
    </div>
  );
};

export default Problem;
