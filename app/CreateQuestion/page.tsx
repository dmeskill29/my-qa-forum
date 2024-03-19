"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Corrected the import path
import Link from "next/link";

const CreateQuestion = () => {
  const TITLE_LIMIT = 100;
  const CONTENT_LIMIT = 1000;
  const TAGS_LIMIT = 200;
  const INDIVIDUAL_TAG_LIMIT = 30; // Limit for each tag

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [prizeInKeys, setPrizeInKeys] = useState(0);
  const [prizeInStarKeys, setPrizeInStarKeys] = useState(0);
  const [tags, setTags] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleTagsChange = (e) => {
    const newTags = e.target.value
      .split(",")
      .map((tag) => tag.trim().slice(0, INDIVIDUAL_TAG_LIMIT))
      .join(", ");
    setTags(newTags);
  };

  const handleCreateWithStarKeys = async (event) => {
    event.preventDefault();

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

    const body = {
      title,
      content,
      userId: session?.user?.id,
      feeInKeys: 0,
      feeInStarKeys: 50, // [2]
      prizeInKeys,
      prizeInStarKeys,
      tags,
    };

    try {
      const response = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // if (!response.ok) {
      //   throw new Error("Network response was not ok");
      // }

      // On success
      const data = await response.json();
      alert(data.message);
      router.push(`/question/${data.result.id}`);
      router.refresh();
      // Consider using router.push for navigation instead of router.refresh()
    } catch (error) {
      console.error("Failed to submit the question:", error);
      // Handle error
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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

    const body = {
      title,
      content,
      userId: session?.user?.id,
      feeInKeys: 50,
      feeInStarKeys: 0,
      prizeInKeys,
      prizeInStarKeys,
      tags,
    };

    try {
      const response = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // On success
      const data = await response.json();
      router.push(`/question/${data.result.id}`);
      router.refresh();
      // Consider using router.push for navigation instead of router.refresh()
    } catch (error) {
      console.error("Failed to submit the question:", error);
      // Handle error
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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center space-y-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
          <p className="text-xl font-medium text-gray-600">
            Please sign in to ask a question
          </p>
          <Link
            href="/sign-in"
            className="text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-2/5 mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-6 mt-8"
    >
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
          placeholder="Enter your question title"
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
          rows="4"
          placeholder="Describe your question in detail"
          className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black block w-full sm:text-sm border-gray-300 rounded-md"
          maxLength={CONTENT_LIMIT}
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

      {/* Prize input */}
      <div>
        <label
          htmlFor="prizeInKeys"
          className="block text-sm font-medium text-gray-700"
        >
          Prize in Keys:
        </label>
        <input
          type="number"
          id="prizeInKeys"
          value={prizeInKeys}
          onChange={(e) => setPrizeInKeys(Number(e.target.value))}
          className="input-field"
          min="0"
        />
      </div>
      <div>
        <label
          htmlFor="prizeInStarKeys"
          className="block text-sm font-medium text-gray-700"
        >
          Prize in Star Keys:
        </label>
        <input
          type="number"
          id="prizeInStarKeys"
          value={prizeInStarKeys}
          onChange={(e) => setPrizeInStarKeys(Number(e.target.value))}
          className="input-field"
          min="0"
        />
      </div>

      {/* Submit button */}
      <div className="flex space-x-2">
        <button
          type="submit"
          className="inline-flex justify-center px-2 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
        >
          Ask with Keys
        </button>
        <button
          onClick={handleCreateWithStarKeys}
          type="button"
          className="inline-flex justify-center px-2 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-300 ease-in-out"
        >
          Ask with Star Keys
        </button>
      </div>
    </form>
  );
};

export default CreateQuestion;
