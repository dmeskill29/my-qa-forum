"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Corrected the import path
import PleaseSignIn from "@/components/PleaseSignIn";

const CreateCircle = () => {
  const NAME_LIMIT = 100;
  const DESCRIPTION_LIMIT = 1000;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter(); // Corrected the import path
  const { data: session, status } = useSession();

  const [ownerSearch, setOwnerSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState(null);

  const handleOwnerSearch = async (query) => {
    setOwnerSearch(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `/api/user/search?query=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Failed to fetch users");
      const users = await response.json();
      setSearchResults(users);
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (name.length > NAME_LIMIT || description.length > DESCRIPTION_LIMIT) {
      alert(
        `Please ensure your name is under ${NAME_LIMIT} characters and your description under ${DESCRIPTION_LIMIT} characters.`
      );
      return;
    }

    const body = {
      name,
      creatorId: selectedOwner.id,
    };

    try {
      const response = await fetch("/api/circle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message); // Throw an error with the server's error message
      }

      // On success
      const data = await response.json();
      router.push(`/circle/${name}`);
      router.refresh();
    } catch (error) {
      console.error("Failed to create the circle:", error);
      alert(error.message); // Display the error message from the server in an alert
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center space-y-2">
          <svg
            className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-500 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-lg text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <PleaseSignIn />;
  }

  if (!session.user.roles.includes("admin")) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-500">
          You do not have permission to create a new circle.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="lg:w-2/5 mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-6 mt-8 sm:w-full"
    >
      <div className="max-w-6xl">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Circle Name:
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Enter the circle name"
          className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-black"
          maxLength={NAME_LIMIT}
        />
      </div>
      {/* Owner search input */}
      <div>
        <label
          htmlFor="owner"
          className="block text-sm font-medium text-gray-700"
        >
          Owner Search:
        </label>
        <div className="relative">
          <input
            type="text"
            id="owner"
            value={ownerSearch}
            onChange={(e) => handleOwnerSearch(e.target.value)}
            placeholder="Search for a user"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
          {searchResults.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {searchResults.map((user) => (
                <li
                  key={user.id}
                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50"
                  onClick={() => {
                    setSelectedOwner(user);
                    setOwnerSearch(user.username);
                    setSearchResults([]);
                  }}
                >
                  {user.username}
                </li>
              ))}
            </ul>
          )}
        </div>
        {selectedOwner && (
          <p className="mt-2 text-sm text-gray-500">
            Selected owner: {selectedOwner.username}
          </p>
        )}
      </div>

      {/* Submit button */}
      <div className="flex space-x-2">
        <button
          type="submit"
          className="inline-flex justify-center px-2 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
        >
          Create Circle
        </button>
      </div>
    </form>
  );
};

export default CreateCircle;
