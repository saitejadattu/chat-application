import React from "react";

const groupMessageBox = (props) => {
  console.log("groupMessageBox", props);
  const { message, isSender } = props;
  return (
    <li
      className={`w-fit max-w-[70%] py-2 px-4 rounded-lg shadow-md mb-2 cursor-pointer ${
        !isSender ? "bg-white self-end" : "bg-green-200 self-start"
      }`}
    >
      <div className="flex flex-col items-end">
        <span className="text-xs text-gray-500 font-bold">{message.senderId.name}</span>
        <p className="text-sm text-gray-900 text-right">{message.text}</p>
      </div>
    </li>
  );
};

export default groupMessageBox;
