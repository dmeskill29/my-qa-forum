"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PleaseSignIn from "@/components/PleaseSignIn";

const CreateGroup = ({ params }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const circleName = params.circleName;

  const maxNameLength = 30;
  const maxDescriptionLength = 160;

  const [circleSearch, setCircleSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCircle, setSelectedCircle] = useState(circleName);

  const handleCircleSearch = async (query) => {
    setCircleSearch(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `/api/circle/search?query=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Failed to fetch circles");
      const circles = await response.json();
      setSearchResults(circles);
    } catch (error) {
      console.error("Error searching circles:", error);
      setSearchResults([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (
        name.length > maxNameLength ||
        description.length > maxDescriptionLength
      ) {
        alert(
          `Please ensure your name is under ${maxNameLength} characters and your description under ${maxDescriptionLength} characters.`
        );
        return;
      }
      const response = await fetch("/api/group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          circleName: selectedCircle,
          public: isPublic,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/circle/${selectedCircle.name}/private/group/${name}`);
      } else {
        throw new Error("Failed to create group");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return <PleaseSignIn />;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Create a New Group</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Group Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={maxNameLength}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            maxLength={maxDescriptionLength}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          ></textarea>
        </div>

        {/* Circle Search Input */}
        <div>
          <label
            htmlFor="circle"
            className="block text-sm font-medium text-gray-700"
          >
            Circle Search:
          </label>
          <div className="relative">
            <input
              type="text"
              id="circle"
              value={circleSearch}
              onChange={(e) => handleCircleSearch(e.target.value)}
              placeholder="Search for a circle"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
            {searchResults.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {searchResults.map((circle) => (
                  <li
                    key={circle.id}
                    className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50"
                    onClick={() => {
                      setSelectedCircle(circle.name);
                      setCircleSearch(circle.name);
                      setSearchResults([]);
                    }}
                  >
                    {circle.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {selectedCircle && (
            <p className="mt-2 text-sm text-gray-500">
              Selected circle: {selectedCircle}
            </p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <label
            htmlFor="isPublic"
            className="ml-2 block text-sm text-gray-900"
          >
            Make this group public
          </label>
        </div>
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? "Creating..." : "Create Group"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroup;
