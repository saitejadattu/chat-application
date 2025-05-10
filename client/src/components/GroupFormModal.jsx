import React, { useState } from "react";
import socket from "./socket";
import Cookies from "js-cookie";
const GroupFormModal = (props) => {
  const { isGroupModel, onClose } = props;
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    password: "",
  });
  const jwtToken = Cookies.get("jwtToken");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description, password } = formData;

    try {
      const response = await fetch("http://localhost:5000/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ name, description, password }),
      });

      if (response.ok) {
        const data = await response.json();
        socket.emit("send_group_created", data);
        onClose();
      } else {
        console.error("Error creating group:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  if (!isGroupModel) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Create Group</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Group Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="p-2 border rounded-md"
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="p-2 border rounded-md"
          />

          <input
            type="password"
            placeholder="Password (optional)"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="p-2 border rounded-md"
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupFormModal;
