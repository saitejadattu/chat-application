import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import EditAndDelete from "./EditAndDeleteModel";
const GroupMessageBox = (props) => {
  //console.log("GroupMessageBox", props);
  const [isHovered, setIsHovered] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isEditAndDelete, setIsEditAndDelete] = useState(false);
  const handleClose = () => {
    setIsEditAndDelete(false);
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const { message, isSender } = props;
  const handlePopUp = (e) => {
    e.stopPropagation();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setIsHovered(false);
    setIsEditAndDelete((prev) => !prev);
    //console.log("handlePopUp", message);
  };
  return (
    <li
      className={`w-fit max-w-[70%] py-2 px-4 rounded-lg shadow-md mb-2 cursor-pointer ${
        !isSender ? "bg-white self-end" : "bg-green-200 self-start"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      <EditAndDelete
        isEditAndDelete={isEditAndDelete}
        menuPosition={menuPosition}
      />
      <div className="flex flex-col items-end relative">
        {isHovered && (
          <IoIosArrowDown
            className="text-gray-500 absolute -top-2 -right-3"
            onClick={handlePopUp}
          />
        )}
        <span className="text-xs text-gray-500 font-bold">
          {message.senderId.name}
        </span>
        <p className="text-sm text-gray-900 text-right">{message.text}</p>
      </div>
    </li>
  );
};

export default GroupMessageBox;
