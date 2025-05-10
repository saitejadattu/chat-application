import React, { useEffect, useRef } from "react";

const EditAndDelete = ({
  isEditAndDelete,
  onEdit,
  onDelete,
  onClose,
  menuPosition,
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose(); // Call onClose when clicked outside
      }
    };

    if (isEditAndDelete) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditAndDelete, onClose]);

  if (!isEditAndDelete) return null;
  //console.log("menuPosition", menuPosition);
  return (
    <div
      ref={menuRef}
      className="absolute w-24 bg-white border shadow-md rounded-md z-50"
      style={{ top: `${menuPosition.y - 110}px`, left: `${menuPosition.x-110}px` }}
    >
      <button
        className="block w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
        onClick={onEdit}
      >
        ✏️ Edit
      </button>
      <button
        className="block w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
        onClick={onDelete}
      >
        🗑️ Delete
      </button>
    </div>
  );
};

export default EditAndDelete;
