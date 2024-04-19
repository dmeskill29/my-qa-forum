import React from "react";

const User = ({ user }) => {
  const ProfileImage = ({}) => {
    const firstLetter = user.username.charAt(0).toUpperCase();

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
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center space-x-4">
        <ProfileImage />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-gray-600">@{user.username}</p>
        </div>
      </div>
      {user.bio && <p className="mt-4 text-gray-600">{user.bio}</p>}
      <div className="mt-4"></div>
    </div>
  );
};

export default User;
