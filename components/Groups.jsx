import React from "react";
import Link from "next/link";

const Groups = ({ circle, session }) => {
  if (session) {
    // Get user's membership in the circle
    const userMembership = circle.members.find(
      (member) => member.userId === session.user.id
    );

    if (!userMembership) {
      // If user is not a member of the circle return the public groups
      const publicGroups = circle.groups.filter((group) => group.public);
      return (
        <div className="bg-gray-100 p-4 flex flex-col items-center rounded-lg shadow-lg mt-4">
          {/* Circle name with Link to circle page */}
          <h1 className="text-2xl font-bold text-gray-800">Groups</h1>
          {/* Link to the circle's public feed */}
          <Link
            href={`/circle/${circle.name}/public`}
            className="hover:underline"
          >
            Public
          </Link>
          {/* List  the public groups in the circle as links */}
          <ul>
            {publicGroups.map((group) => (
              <li key={group.id} className="flex items-center space-x-2">
                <Link
                  href={`/circle/${circle.name}/public/group/${group.name}`}
                  className="text-blue-600 hover:underline"
                >
                  {group.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      );
    } else {
      // Check if user is a member of the circle
      const isMember = userMembership.role.includes("member");

      // Check if the member has employee role
      const isEmployee = userMembership.role.includes("employee");

      // Check if the member has creator role
      const isCreator = userMembership.role.includes("creator");

      // Filter the public groups in the circle
      const publicGroups = circle.groups.filter((group) => group.public);

      // Filter the private groups the employee has access to
      const privateGroups = circle.groups.filter((group) => !group.public);

      const employeeGroups = privateGroups.filter((group) =>
        userMembership.groupAccess.includes(group.name)
      );

      return (
        <div className="bg-gray-100 p-4 flex flex-col items-center rounded-lg shadow-lg mt-4">
          {/* Circle name with Link to circle page */}
          <h1 className="text-2xl font-bold text-gray-800">Groups</h1>
          {/* Link to the circle's public feed */}
          <Link
            href={`/circle/${circle.name}/public`}
            className="hover:underline"
          >
            Public
          </Link>

          {isCreator && (
            <div className="mb-4 ml-2">
              <Link
                href={`/circle/${circle.name}/public/group/create`}
                className="inline-flex items-center px-2 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-white hover:bg-gray-200 transition duration-150 ease-in-out"
              >
                <svg className="w-5 h-5 " viewBox="0 0 20 20" fill="black">
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          )}
          {/* List  the public groups in the circle as links */}
          <ul>
            {publicGroups.map((group) => (
              <li key={group.id} className="flex items-center space-x-2">
                <Link
                  href={`/circle/${circle.name}/public/group/${group.name}`}
                  className="text-blue-600 hover:underline"
                >
                  {group.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Link to the circle's private feed for employees only */}
          {isEmployee && (
            <Link
              href={`/circle/${circle.name}/private`}
              className="hover:underline"
            >
              Private
            </Link>
          )}

          {isCreator && (
            <div className="mb-4 ml-2">
              <Link
                href={`/circle/${circle.name}/private/group/create`}
                className="inline-flex items-center px-2 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-white hover:bg-gray-200 transition duration-150 ease-in-out"
              >
                <svg className="w-5 h-5 " viewBox="0 0 20 20" fill="black">
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          )}
          {/* List the private groups in the circle the employee has access to */}
          {isEmployee && (
            <ul>
              {employeeGroups.map((group) => (
                <li key={group.id} className="flex items-center space-x-2">
                  <Link
                    href={`/circle/${circle.name}/private/group/${group.name}`}
                    className="text-blue-600 hover:underline"
                  >
                    {group.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }
  } else {
    // Filter the public groups in the circle
    const publicGroups = circle.groups.filter((group) => group.public);
    return (
      <div className="bg-gray-100 p-4 flex flex-col items-center rounded-lg shadow-lg mt-4">
        {/* Circle name with Link to circle page */}
        <h1 className="text-2xl font-bold text-gray-800">Groups</h1>
        {/* Link to the circle's public feed */}
        <Link
          href={`/circle/${circle.name}/public`}
          className="hover:underline"
        >
          Public
        </Link>
        {/* List  the public groups in the circle as links */}
        <ul>
          {publicGroups.map((group) => (
            <li key={group.id} className="flex items-center space-x-2">
              <Link
                href={`/circle/${circle.name}/public/group/${group.name}`}
                className="text-blue-600 hover:underline"
              >
                {group.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

export default Groups;
