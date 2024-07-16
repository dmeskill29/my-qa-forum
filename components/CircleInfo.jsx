import Link from "next/link";
import React from "react";
import DescriptionUpdate from "@/components/DescriptionUpdate";
import JoinCircleButton from "@/components/JoinCircleButton";

const CircleInfo = ({ circle, session }) => {
  let userMembership;
  let isMember;
  let isEmployee;
  let isOwner;
  if (session) {
    // Get user's membership in the circle
    userMembership = circle.members.find(
      (member) => member.userId === session.user.id
    );

    if (!userMembership) {
      // If user is not a member of the circle offer to join
      return (
        <div className="bg-gray-100 p-4 flex flex-col items-center rounded-lg shadow-lg mt-4">
          {/* Circle name with Link to circle page */}
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            <Link href={`/circle/${circle.name}`} className="hover:underline">
              {circle.name}
            </Link>
          </h1>
          <p className="text-gray-600 text-center ">
            {" "}
            {circle.description
              ? circle.description
              : "No description available"}{" "}
          </p>
          {/* button to join the circle */}
          <JoinCircleButton circle={circle} />
        </div>
      );
    } else {
      // Check if user is a member of the circle
      isMember = userMembership.role.includes("member");

      // Check if the member has employee role
      isEmployee = userMembership.role.includes("employee");

      // Check if the member has creator role
      isOwner = userMembership.role.includes("creator");

      return (
        <div className="bg-gray-100 p-4 flex flex-col items-center rounded-lg shadow-lg mt-4">
          {/* Circle name with Link to circle page */}
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            <Link href={`/circle/${circle.name}`} className="hover:underline">
              {circle.name}
            </Link>
          </h1>
          {/* creator settings link */}
          {isOwner && (
            <Link
              href={`/circle/${circle.name}/settings`}
              className="text-blue-600 hover:underline"
            >
              Settings
            </Link>
          )}
          {/* Circle description */}
          <p className="text-gray-600 text-center ">
            {" "}
            {circle.description
              ? circle.description
              : "No description available"}{" "}
          </p>
          {/* Edit description component */}
          {isOwner && <DescriptionUpdate circle={circle} />}
        </div>
      );
    }
  } else {
    return (
      <div className="bg-gray-100 p-4 flex flex-col items-center rounded-lg shadow-lg mt-4">
        {/* Circle name with Link to circle page */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          <Link href={`/circle/${circle.name}`} className="hover:underline">
            {circle.name}
          </Link>
        </h1>
        <p className="text-gray-600 text-center ">
          {" "}
          {circle.description
            ? circle.description
            : "No description available"}{" "}
        </p>
      </div>
    );
  }
};

export default CircleInfo;
