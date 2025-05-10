// components/PopupMenu.jsx
import React from "react";

const EditAndDelete = ({ isEditAndDelete, onEdit, onDelete, menuPosition }) => {
  if (!isEditAndDelete) return null;

  return (
    <div
      className="absolute mt-2 w-28 bg-white rounded-lg shadow-lg border z-50"
      style={{
        top: menuPosition?.y ? `${menuPosition.y + 10}px` : "0px", // 10px below click
        left: menuPosition?.x ? `${menuPosition.x}px` : "0px",
      }}
    >
      <button
        onClick={onEdit}
        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
      >
        Edit
      </button>
      <button
        onClick={onDelete}
        className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
      >
        Delete
      </button>
    </div>
  );
};

export default EditAndDelete;
