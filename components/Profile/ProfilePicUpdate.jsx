"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ProfilePictureUpdate = ({ session }) => {
  const [selectedPicture, setSelectedPicture] = useState(
    session?.user?.image || ""
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const profilePictures = [
    { id: 1, src: "/scpfp_cool.png", alt: "Cool Profile Picture" },
    {
      id: 2,
      src: "/scpfp_inquisitive.png",
      alt: "Inquisitive Profile Picture",
    },
    { id: 3, src: "/scpfp_meh.png", alt: "Meh Profile Picture" },
    { id: 4, src: "/scpfp_nerdy.png", alt: "Nerdy Profile Picture" },
    { id: 5, src: "/scpfp_smile.png", alt: "Smile Profile Picture" },
    { id: 6, src: "/scpfp_smirk.png", alt: "Smirk Profile Picture" },
    { id: 7, src: "/scpfp_stressed.png", alt: "Stressed Profile Picture" },
    { id: 8, src: "/scpfp_sweat.png", alt: "Sweat Profile Picture" },
    { id: 9, src: "/scpfp_what.png", alt: "What Profile Picture" },
    // Add the rest of the profile pictures
  ];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handlePictureClick = (picture) => {
    setSelectedPicture(picture.src);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      profilePic: selectedPicture,
    };

    try {
      const response = await fetch("/api/profilePicUpdate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsModalOpen(false);
        router.refresh();
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Failed to update the profile picture:", error);
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="middle none center rounded-full bg-gray-800 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-800/20 transition-all hover:shadow-lg hover:shadow-gray-800/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      >
        Update
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  Select Profile Picture
                </h3>
                <button
                  onClick={closeModal}
                  className="absolute top-0 right-0 p-4"
                >
                  <span className="text-gray-400 hover:text-gray-500">
                    &times;
                  </span>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="mt-2">
                <div className="profile-pictures grid grid-cols-3 gap-4">
                  {profilePictures.map((picture) => (
                    <div
                      key={picture.id}
                      className={`profile-picture relative cursor-pointer ${
                        selectedPicture === picture.src
                          ? "border-4 border-green-500"
                          : ""
                      }`}
                      onClick={() => handlePictureClick(picture)}
                    >
                      <img
                        src={picture.src}
                        alt={picture.alt}
                        className="w-full h-auto rounded-md"
                      />
                      {selectedPicture === picture.src && (
                        <div className="absolute top-0 right-0 p-1 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    id="ok-btn"
                    className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    Update Profile Picture
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePictureUpdate;
