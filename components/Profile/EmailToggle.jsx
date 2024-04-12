"use client";
import React, { useState } from "react"; // Simplified import

const EmailToggle = ({ emailNotified }) => {
  const [emailNotifications, setEmailNotifications] = useState(emailNotified);

  const handleEmailNotificationsChange = async (e) => {
    const newEmailNotificationsValue = e.target.checked;

    try {
      // Send the updated emailNotifications value to the server
      const response = await fetch("/api/emailNotifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailNotifications: newEmailNotificationsValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Successfully updated the state on the server, now reflect it in the component state
      setEmailNotifications(newEmailNotificationsValue);
    } catch (error) {
      console.error("Failed to update email notifications:", error);
    }
  };

  return (
    <div className="mt-4">
      <label
        htmlFor="email-notifications"
        className="flex items-center cursor-pointer"
      >
        <div className="relative">
          <input
            type="checkbox"
            id="email-notifications"
            className="sr-only"
            checked={emailNotifications}
            onChange={handleEmailNotificationsChange}
          />
          <div
            className={`w-10 h-4  rounded-full shadow-inner ${
              emailNotifications ? "transform  bg-green-400" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`dot absolute left-0 -top-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ease-in-out ${
              emailNotifications ? "transform translate-x-6" : ""
            }`}
          ></div>
        </div>
        <div className="ml-3 text-sm font-medium text-gray-700">
          Email Notifications
        </div>
      </label>
    </div>
  );
};

export default EmailToggle;
