"use client";
import React, { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Corrected the import path
import Image from "next/image";
import PleaseSignIn from "@/components/PleaseSignIn";
import { useSearchParams } from "next/navigation";

const CreateProblem = () => {
  const searchParams = useSearchParams();
  const circleName = searchParams.get("query");
  const TITLE_LIMIT = 100;
  const CONTENT_LIMIT = 1000;
  const TAGS_LIMIT = 200;
  const INDIVIDUAL_TAG_LIMIT = 30; // Limit for each tag

  const { data: session, status } = useSession();

  const [inCircle, setInCircle] = useState(false);
  const [notInCircle, setNotInCircle] = useState(false);

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

  const [circleMembership, setCircleMembership] = useState([]);

  const fetchCircleMembership = async () => {
    if (!session) return;

    try {
      const response = await fetch(`/api/circle/${selectedCircle}/membership`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch circle membership");

      const data = await response.json();
      setCircleMembership(data);
    } catch (error) {
      console.error("Error fetching circle membership:", error);
    }
  };

  useEffect(() => {
    fetchCircleMembership();
  }, [selectedCircle]);

  // Public or private post
  const [postVisibility, setPostVisibility] = useState("public");

  // Group search input

  const [selectedPublicGroups, setSelectedPublicGroups] = useState([]);
  const [selectedPrivateGroups, setSelectedPrivateGroups] = useState([]);

  const [type, setType] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter(); // Corrected the import path

  const [tagSearch, setTagSearch] = useState("");
  const [tagSearchResults, setTagSearchResults] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTags, setNewTags] = useState([]);
  console.log(selectedTags);
  console.log(newTags);

  const handleTagSearch = async (query) => {
    setTagSearch(query);
    if (query.length < 2) {
      setTagSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `/api/tag/search?query=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Failed to fetch tags");
      const tags = await response.json();
      setTagSearchResults(tags);
    } catch (error) {
      console.error("Error searching tags:", error);
      setTagSearchResults([]);
    }
  };

  const addTag = (tag) => {
    if (!selectedTags.some((t) => t.id === tag.id)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
    setTagSearch("");
    setTagSearchResults([]);
  };

  const addNewTag = async () => {
    setNewTags((prev) => [...prev, { name: tagSearch.toLowerCase() }]);
    setSelectedTags((prev) => [...prev, { name: tagSearch.toLowerCase() }]);
    setTagSearch("");
    setTagSearchResults([]);
  };

  const removeTag = (tag) => {
    setSelectedTags((prev) => prev.filter((t) => t.id !== tag.id));
    setNewTags((prev) => prev.filter((t) => t.name !== tag.name));
  };

  const [displayCircleValue, setDisplayCircleValue] = useState("");
  const [displayStarValue, setDisplayStarValue] = useState("");
  const [tokens, setTokens] = useState("");

  const [prizeInTokens, setPrizeInTokens] = useState(0);
  const [prizeInCircleKeys, setPrizeInCircleKeys] = useState(0);
  const [prizeInStarKeys, setPrizeInStarKeys] = useState(0);
  const [duration, setDuration] = useState(7);
  // Get user's circle membership

  const handleTokenChange = (e) => {
    const newValue = e.target.value;
    setTokens(newValue); // Update display value directly with input

    // Update the actual prizeInCircleKeys state only if the new value is a number
    const numericValue = Number(newValue);
    if (!isNaN(numericValue)) {
      setPrizeInTokens(numericValue);
    }
  };

  const handleCircleChange = (e) => {
    const newValue = e.target.value;
    setDisplayCircleValue(newValue); // Update display value directly with input

    // Update the actual prizeInCircleKeys state only if the new value is a number
    const numericValue = Number(newValue);
    if (!isNaN(numericValue)) {
      setPrizeInCircleKeys(numericValue);
    }
  };

  const handleStarChange = (e) => {
    const newValue = e.target.value;
    setDisplayStarValue(newValue); // Update display value directly with input

    // Update the actual prizeInCircleKeys state only if the new value is a number
    const numericValue = Number(newValue);
    if (!isNaN(numericValue)) {
      setPrizeInStarKeys(numericValue);
    }
  };

  const handleTagsChange = (e) => {
    const input = e.target.value;
    setTags(input); // Keep the raw input

    // Process into array whenever the input changes
    const newTagsArray = input
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag); // Remove empty strings, if any

    setTagsArray(newTagsArray); // Update the tags array
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const contentWithBreaks = content.replace(/\n/g, "<br/>");

    if (prizeInCircleKeys < 0 || prizeInStarKeys < 0) {
      alert("Prizes cannot be negative.");
      return;
    }

    // Split tags by commas, trim whitespace, and check each tag's length
    const tagsArray = tags.split(",").map((tag) => tag.trim());
    const invalidTag = tagsArray.some(
      (tag) => tag.length > INDIVIDUAL_TAG_LIMIT
    );

    if (invalidTag) {
      alert(`Each tag must be under ${INDIVIDUAL_TAG_LIMIT} characters.`);
      return;
    }

    if (
      title.length > TITLE_LIMIT ||
      content.length > CONTENT_LIMIT ||
      tags.length > TAGS_LIMIT
    ) {
      alert(
        `Please ensure your title is under ${TITLE_LIMIT} characters, your content under ${CONTENT_LIMIT} characters, and your tags under ${TAGS_LIMIT} characters.`
      );
      return;
    }

    if (duration <= 0) {
      alert("Duration must be a positive number.");
      return;
    }
    if (duration > 14) {
      alert("Duration must be less than or equal to 14 days.");
      return;
    }

    if (!selectedCircle) {
      alert("Please select a circle to post in.");
      return;
    }

    const body = {
      type,
      title,
      content: contentWithBreaks,
      session: session,
      prizeInCircleKeys,
      prizeInStarKeys,
      prizeInTokens,
      tags,
      duration: Number(duration), // Convert duration to a number
      circleName: selectedCircle,
    };

    try {
      const response = await fetch("/api/problem", {
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
      router.push(`/problem/${data.result.id}`);
      router.refresh();
    } catch (error) {
      console.error("Failed to submit the problem:", error);
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

  return (
    <form
      onSubmit={handleSubmit}
      className="lg:w-2/5 mx-auto bg-white rounded-xl shadow-md  p-6 space-y-6 mt-8 sm:w-full"
    >
      {" "}
      {/* dropdown for in a circle or not in a circle */}
      <div>
        <label
          htmlFor="circle"
          className="block text-sm font-medium text-gray-700"
        >
          Post in a circle?
        </label>
        <select
          id="circle"
          value={inCircle ? "yes" : notInCircle ? "no" : ""}
          onChange={(e) => {
            if (e.target.value === "") {
              setInCircle(false);
              setNotInCircle(false);
              setType("");
            }
            if (e.target.value === "yes") {
              setInCircle(true);
              setNotInCircle(false);
              setType("");
            } else {
              setInCircle(false);
              setNotInCircle(true);
              setType("problem");
            }
          }}
          className="mt-1 block w-small pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Select an option</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
      {/* Circle Search Input if in circle */}
      {notInCircle && (
        <div className="max-w-6xl space-y-6">
          <div className="max-w-6xl">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title:
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter your title"
              className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-black"
              maxLength={TITLE_LIMIT}
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Content:
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
              placeholder="Describe in detail"
              className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black block w-full sm:text-sm border-gray-300 rounded-md"
              maxLength={CONTENT_LIMIT}
              style={{ whiteSpace: "pre-wrap" }}
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700"
            >
              Tags:
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={handleTagsChange}
              placeholder="Add tags separated by commas"
              className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="max-w-6xl space-y-6">
            {/* Prize input */}

            <div className="flex items-center space-x-2">
              <label
                htmlFor="prizeInCircleKeys"
                className="text-sm font-medium text-gray-700 flex items-center gap-1"
              >
                Prize in{" "}
                <Image
                  src="/CircleKey.png"
                  alt="Circle Key"
                  width="20"
                  height="20"
                />{" "}
                :
              </label>
              <input
                type="number"
                id="prizeInCircleKeys"
                value={displayCircleValue} // Use displayValue here
                onChange={handleCircleChange} // Use handleCricleChange here
                className="input-field"
                min="0"
                placeholder="Enter prize amount" // Optional placeholder for better UX
              />
            </div>
            <div class="flex items-center space-x-2">
              <label
                htmlFor="prizeInStarKeys"
                className="text-sm font-medium text-gray-700 flex items-center gap-1"
              >
                Prize in{" "}
                <Image
                  src="/StarKey.png"
                  alt="Star Key"
                  width="20"
                  height="20"
                />
                :
              </label>
              <input
                type="number"
                id="prizeInStarKeys"
                value={displayStarValue}
                onChange={handleStarChange}
                className="input-field"
                min="0"
                placeholder="Enter prize amount"
              />
            </div>
            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700"
              >
                Duration (in days):
              </label>
              <input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter the number of days the problem should be open"
                className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black block w-full sm:text-sm border-gray-300 rounded-md"
                min="1"
                max="14"
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="flex space-x-2">
            <button
              type="submit"
              className="inline-flex justify-center px-2 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
            >
              Post
            </button>
          </div>
        </div>
      )}
      {inCircle && (
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
              className="mt-1 block w-small pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
            {searchResults.length > 0 && (
              <ul
                className="absolute z-10 mt-1 w-flex
           bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
              >
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
            <div className="flex items-center space-x-4 mt-3 p-3  rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 font-medium">
                Selected circle:{" "}
                <span className="text-indigo-600">
                  {selectedCircle || "None"}
                </span>
              </p>
              <button
                type="button"
                onClick={() => setSelectedCircle("")}
                className="px-3 py-1 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}
      {/* public or private post */}
      {selectedCircle && circleMembership.length !== 0 && (
        <div>
          <label
            htmlFor="visibility"
            className="block text-sm font-medium text-gray-700"
          >
            Post Visibility:
          </label>
          <select
            id="visibility"
            value={postVisibility}
            onChange={(e) => {
              if (e.target.value === "public") {
                setPostVisibility(e.target.value);
                setSelectedPrivateGroups([]);
              } else {
                setPostVisibility(e.target.value);
                setSelectedPublicGroups([]);
              }
            }}
            className="mt-1 block w-small pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="public">Public</option>
            {circleMembership.role.includes("employee") ? (
              <option value="private">Private</option>
            ) : null}
          </select>
        </div>
      )}
      {/* Select groups by pressing button for group name that the user has access to */}
      {postVisibility === "private" && circleMembership.length !== 0 && (
        <div className="mt-4">
          <label
            htmlFor="groups"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Groups:
          </label>
          <div className="flex flex-wrap gap-2">
            {circleMembership.groupAccess.map((group) => {
              const isSelected = selectedPrivateGroups.some(
                (sg) => sg.id === group.id
              );
              return (
                <button
                  key={group}
                  type="button"
                  onClick={() => {
                    setSelectedPrivateGroups((prev) =>
                      isSelected
                        ? prev.filter((sg) => sg.id !== group.id)
                        : [...prev, group]
                    );
                  }}
                  className={`inline-flex items-center px-3 py-1.5 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                    isSelected
                      ? "border-indigo-500 text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                      : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                  }`}
                >
                  {group}
                  {isSelected && (
                    <svg
                      className="ml-2 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {postVisibility === "public" && circleMembership.length !== 0 && (
        <div className="mt-4">
          <label
            htmlFor="groups"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Groups:
          </label>
          <div className="flex flex-wrap gap-2">
            {circleMembership.groupPublicNotifications.map((group) => {
              const isSelected = selectedPublicGroups.some(
                (sg) => sg.id === group.id
              );
              return (
                <button
                  key={group}
                  type="button"
                  onClick={() => {
                    setSelectedPublicGroups((prev) =>
                      isSelected
                        ? prev.filter((sg) => sg.id !== group.id)
                        : [...prev, group]
                    );
                  }}
                  className={`inline-flex items-center px-3 py-1.5 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                    isSelected
                      ? "border-indigo-500 text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                      : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                  }`}
                >
                  {group}
                  {isSelected && (
                    <svg
                      className="ml-2 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {selectedPublicGroups.length !== 0 ||
      selectedPrivateGroups.length !== 0 ? (
        <div className="max-w-6xl">
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700"
          >
            Post Type:
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            // classname is small dropdown
            className="mt-1 block w-small pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select a type</option>
            <option value="problem">Problem</option>
            {circleMembership.role.includes("moderator") ? (
              <>
                <option value="announcement">Announcement</option>
                <option value="task">Task</option>
              </>
            ) : null}
          </select>
        </div>
      ) : null}
      {type === "task" || type === "problem" || type === "announcement" ? (
        <div className="max-w-6xl space-y-6">
          <div className="max-w-6xl">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title:
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter your title"
              className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-black"
              maxLength={TITLE_LIMIT}
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Content:
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
              placeholder="Describe in detail"
              className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black block w-full sm:text-sm border-gray-300 rounded-md"
              maxLength={CONTENT_LIMIT}
              style={{ whiteSpace: "pre-wrap" }}
            ></textarea>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tag Search:
              </label>
              <input
                type="text"
                id="tags"
                value={tagSearch}
                onChange={(e) => handleTagSearch(e.target.value)}
                placeholder="Search for a tag"
                className="w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              />
              {tagSearchResults.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {tagSearchResults.map((tag) => (
                    <li
                      key={tag.id}
                      className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50"
                      onClick={() => addTag(tag)}
                    >
                      {tag.name}
                    </li>
                  ))}
                </ul>
              )}

              {tagSearch.length > 0 &&
                !tagSearchResults.some(
                  (tag) => tag.name.toLowerCase() === tagSearch.toLowerCase()
                ) && (
                  <li
                    className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50 text-indigo-600"
                    onClick={addNewTag}
                  >
                    Add new tag: {tagSearch.toLowerCase()}
                  </li>
                )}
            </div>

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                {selectedTags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {tag.name}
                    <button
                      type="button"
                      className="ml-1 inline-flex text-indigo-400 focus:outline-none"
                      onClick={() => removeTag(tag)}
                    >
                      <span className="sr-only">Remove tag</span>
                      <svg
                        className="h-3 w-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => setSelectedTags([])}
                  className="px-2 py-1 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/*  if circle is selected and authorized, show token input */}
          {type === "task" || type === "problem" ? (
            <div className="max-w-6xl space-y-6">
              {/* Prize input */}
              {circleMembership.role.includes("moderator") ? (
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="prizeInTokens"
                    className="text-sm font-medium text-gray-700 flex items-center gap-1"
                  >
                    Prize in {selectedCircle} Tokens :
                  </label>
                  <input
                    type="number"
                    id="prizeInTokens"
                    value={tokens} // Use displayValue here
                    onChange={handleTokenChange} // Use handleTokenChange here
                    className="input-field"
                    min="0"
                    placeholder="Enter prize amount" // Optional placeholder for better UX
                  />
                </div>
              ) : null}
              <div className="flex items-center space-x-2">
                <label
                  htmlFor="prizeInCircleKeys"
                  className="text-sm font-medium text-gray-700 flex items-center gap-1"
                >
                  Prize in{" "}
                  <Image
                    src="/CircleKey.png"
                    alt="Circle Key"
                    width="20"
                    height="20"
                  />{" "}
                  :
                </label>
                <input
                  type="number"
                  id="prizeInCircleKeys"
                  value={displayCircleValue} // Use displayValue here
                  onChange={handleCircleChange} // Use handleCricleChange here
                  className="input-field"
                  min="0"
                  placeholder="Enter prize amount" // Optional placeholder for better UX
                />
              </div>
              <div class="flex items-center space-x-2">
                <label
                  htmlFor="prizeInStarKeys"
                  className="text-sm font-medium text-gray-700 flex items-center gap-1"
                >
                  Prize in{" "}
                  <Image
                    src="/StarKey.png"
                    alt="Star Key"
                    width="20"
                    height="20"
                  />
                  :
                </label>
                <input
                  type="number"
                  id="prizeInStarKeys"
                  value={displayStarValue}
                  onChange={handleStarChange}
                  className="input-field"
                  min="0"
                  placeholder="Enter prize amount"
                />
              </div>
              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700"
                >
                  Duration (in days):
                </label>
                <input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Enter the number of days the problem should be open"
                  className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black block w-full sm:text-sm border-gray-300 rounded-md"
                  min="1"
                  max="14"
                />
              </div>
            </div>
          ) : null}
          {/* Submit button */}
          <div className="flex space-x-2">
            <button
              type="submit"
              className="inline-flex justify-center px-2 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
            >
              Post
            </button>
          </div>
        </div>
      ) : null}
    </form>
  );
};

export default CreateProblem;
