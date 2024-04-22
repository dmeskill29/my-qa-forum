import React from "react";
import { db } from "@/lib/db";
import Link from "next/link";
import UsernameUpdate from "@/components/Profile/UsernameUpdate";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import BioUpdate from "@/components/Profile/BioUpdate";
import EmailToggle from "@/components/Profile/EmailToggle";
import KeyChain from "@/components/Profile/KeyChain";
import PleaseSignIn from "@/components/PleaseSignIn";
import NoUser from "@/components/Profile/NoUser";
import ProfilePicUpdate from "@/components/Profile/ProfilePicUpdate";
import Image from "next/image";

const ProfilePage = async ({ params }) => {
  const session = await getServerSession(authOptions);

  const user = await db.user.findUnique({
    where: {
      username: params.username,
    },
  });

  const isAdmin = user?.roles.includes("admin");

  const keychainId = user?.keychainId;

  const keyChain = keychainId
    ? await db.keyChain.findUnique({
        where: {
          id: keychainId,
        },
      })
    : null;

  if (!user) {
    return <NoUser />;
  }

  if (!session) {
    return <PleaseSignIn />;
  }

  const ProfileLinks = ({ username }) => (
    <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-4 mt-4 mb-4 sm:mt-0">
      <Link href={`/user/${username}/problems`} className="profile-link ">
        Problems
      </Link>
      <Link href={`/user/${username}/solutions`} className="profile-link ">
        Solutions
      </Link>
    </div>
  );

  const ProfileSection = ({ title, content, editable, children }) => (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {editable && children}
      </div>
      <p className="text-gray-700 text-base mt-2 break-words">{content}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 lg:flex-row flex">
      <div className="lg:w-1/4 lg:flex lg:flex-col lg:items-start sm:w-full">
        <div
          className={`bg-white shadow rounded-lg p-6 w-full ${
            isAdmin ? "border-4 border-blue-500" : ""
          }`}
        >
          <h1 className="text-2xl sm:text-4xl font-extrabold text-indigo-700 mb-2">
            {user.username}&apos;s Profile
          </h1>
          <ProfileSection
            title="Profile Pic"
            content={
              user.image && <Image src={user.image} width={35} height={35} />
            }
            editable
          >
            {user.id === session?.user?.id && <ProfilePicUpdate />}
          </ProfileSection>
          <ProfileSection title="Username" content={user.username} editable>
            {user.id === session?.user?.id && (
              <UsernameUpdate session={session} />
            )}
          </ProfileSection>
          <ProfileSection
            title="Bio"
            content={user.bio || "No bio provided."}
            editable
          >
            {user.id === session?.user?.id && <BioUpdate session={session} />}
          </ProfileSection>
          {user.id === session?.user?.id && (
            <KeyChain keyChain={keyChain} user={user} />
          )}
          {user.id === session?.user?.id && (
            <EmailToggle emailNotified={user.emailNotified} />
          )}
        </div>
      </div>
      <ProfileLinks username={user.username} />
    </div>
  );
};

export default ProfilePage;
