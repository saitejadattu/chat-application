import React from "react";

const MessageBox = (props) => {
  const { message, isSender } = props;
  return (
    <li
      className={`w-fit py-2 px-4 rounded-lg shadow-md mb-2 cursor-pointer  ${
        !isSender ? "bg-white" : "bg-green-200 self-end"
      }`}
    >
      <div
        className={`flex flex-col`}
      >
        <p className={`text-sm text-gray-600`}>{message.text}</p>
      </div>
    </li>
  );
};

export default MessageBox;
