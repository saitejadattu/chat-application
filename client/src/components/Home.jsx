import React, { useState, useEffect, useRef } from "react";
import LoadingUi from "../Ui's/LoadingUi.jsx";
import NavBar from "./NavBar.jsx";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import MessageBox from "./MessageBox.jsx";
import socket from "./socket.jsx";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import GroupMessageBox from "./groupMessageBox.jsx";
import GroupFormModal from "./GroupFormModal.jsx";
import EditAndDelete from "./EditAndDeleteModel.jsx";
import { BsThreeDotsVertical } from "react-icons/bs";

const Home = () => {
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // console.log(socket);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState("");
  const [isGroup, setIsGroup] = useState(false);
  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState("");
  const [groupMessages, setGroupMessages] = useState([]);
  const [isGroupModel, setIsGroupModel] = useState(false);
  const [isEditAndDelete, setIsEditAndDelete] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef(null);

  const jwtToken = Cookies.get("jwtToken");
  const decode = jwtDecode(jwtToken);
  //console.log(decode);
  const handleMessage = (e) => {
    setMessage(e.target.value);
  };
  const handleGroupMessage = (e) => {
    setMessage(e.target.value);
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, groupMessages]);

  const handleGroupForm = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/group/${group._id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderId: decode.id,
        groupId: group._id,
        text: message,
      }),
    });
    const parsedResponse = await response.json();
    socket.emit("send_group_message", parsedResponse.groupMessage);
    setMessage("");
  };
  const handleForm = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderId: decode.id,
        receiverId: receiver._id,
        text: message,
      }),
    });
    const parsedResponse = await response.json();
    socket.emit("send_message", parsedResponse);
    setMessage("");
  };
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("http://localhost:5000/user/users");
      const parseResponse = await response.json();
      setUsers(parseResponse);
    };
    fetchUsers();
  }, []);
  useEffect(() => {
    const fetchGroups = async () => {
      const response = await fetch("http://localhost:5000/groups");
      const parseResponse = await response.json();
      setGroups(parseResponse.groups);
    };
    fetchGroups();
  }, []);
  useEffect(() => {
    socket.on("receive_message", (data) => {
      //console.log(data);
      setMessages((prev) => [...prev, data]);
    });
    return () => socket.off("receive_message");
  }, []);
  useEffect(() => {
    socket.on("receive_group_message", (data) => {
      //console.log("group message", data);
      setGroupMessages((prev) => [...prev, data]);
    });
    return () => socket.off("receive_group_message");
  }, []);
  useEffect(() => {
    socket.on("receive_group_created", (data) => {
      //console.log(data.group);
      setGroups((prev) => [...prev, data.group]);
    });
    return () => socket.off("receive_group_created");
  }, []);

  const connectGroup = async (group) => {
    setGroup(group);
    //console.log(group);
    const response = await fetch(`http://localhost:5000/group/${group._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    const parseResponse = await response.json();
    setGroupMessages(parseResponse.groupMessages);
  };
  const connectUser = async (user) => {
    setReceiver(user);
    const response = await fetch(
      `http://localhost:5000/messages/${user._id}/${decode.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    const parseResponse = await response.json();
    setMessages(parseResponse);
    socket.emit("join_group", user._id);
  };
  const handleEditAndDelete = (e) => {
    e.stopPropagation();
    setIsEditAndDelete((prev) => !prev);
    setMenuPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleDelete = async () => {
    if (isGroup) {
      const response = await fetch(`http://localhost:5000/group/${group._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });
      const parseResponse = await response.json();
      console.log(parseResponse);
    } else {
      const response = await fetch(
        `http://localhost:5000/user/delete/${receiver._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const parseResponse = await response.json();
      console.log(parseResponse);
    }
  };

  return (
    <div
      className={`h-screen w-full flex flex-col ${
        isDarkMode ? "bg-black" : "bg-white"
      }`}
    >
      <NavBar />
      <GroupFormModal
        isGroupModel={isGroupModel}
        onClose={() => setIsGroupModel(false)}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-2/5 p-5 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <button
              type="button"
              onClick={() => setIsGroup((prev) => !prev)}
              className="text-white"
            >
              {isGroup ? "Groups" : "Chats"}
            </button>
            {isGroup && (
              <MdOutlineCreateNewFolder
                className="text-white cursor-pointer"
                onClick={() => setIsGroupModel(true)}
              />
            )}
          </div>
          <div className="relative">
            <EditAndDelete
              isEditAndDelete={isEditAndDelete}
              menuPosition={menuPosition}
              onDelete={handleDelete}
              onClose={() => setIsEditAndDelete(false)}
            />
          </div>
          {isGroup ? (
            <ul>
              {groups.length
                ? groups.map((group, index) => (
                    <li
                      onClick={() => connectGroup(group)}
                      key={index}
                      className="flex items-center justify-between border-b-2 border-white py-2 cursor-pointer"
                    >
                      <div className="flex items-center">
                        <img
                          src={`http://localhost:5000/${group.name}`}
                          alt=""
                          className="w-[50px] h-[50px] rounded-full"
                        />
                        <p className="text-white ml-3">{group.name}</p>
                      </div>
                      <BsThreeDotsVertical
                        className="text-white"
                        onClick={handleEditAndDelete}
                      />
                    </li>
                  ))
                : Array.from({ length: 8 }).map((_, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between border-b-2 border-white py-2 animate-pulse"
                    >
                      <div className="flex items-center">
                        <div className="w-[50px] h-[50px] rounded-full bg-gray-300" />
                        <div className="ml-3 h-8 w-24 bg-gray-300 rounded" />
                      </div>
                    </li>
                  ))}
            </ul>
          ) : (
            <ul>
              {users.length
                ? users
                    .filter((user) => user._id !== decode.id)
                    .map((user, index) => (
                      <li
                        onClick={() => connectUser(user)}
                        key={index}
                        className="flex items-center justify-between border-b-2 border-white py-2 cursor-pointer"
                      >
                        <div className="flex items-center">
                          <img
                            src={`http://localhost:5000/${user.profile}`}
                            alt=""
                            className="w-[50px] h-[50px] rounded-full"
                          />
                          <p className="text-white ml-3">{user.name}</p>
                        </div>
                        <BsThreeDotsVertical
                          className="text-white"
                          onClick={handleEditAndDelete}
                        />
                      </li>
                    ))
                : Array.from({ length: 8 }).map((_, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between border-b-2 border-white py-2 animate-pulse"
                    >
                      <div className="flex items-center">
                        <div className="w-[50px] h-[50px] rounded-full bg-gray-300" />
                        <div className="ml-3 h-8 w-24 bg-gray-300 rounded" />
                      </div>
                    </li>
                  ))}
            </ul>
          )}
        </div>
        <div className="flex-1 flex flex-col relative">
          {group && isGroup && (
            <div className="flex items-center p-5 border-b border-gray-700">
              <img
                src={`http://localhost:5000/${group.name}`}
                alt=""
                className="w-[50px] h-[50px] rounded-full"
              />
              <div className="flex flex-col">
                <p className="text-white ml-3">{group.name}</p>
                <p className="text-white ml-3">{group.description}</p>
              </div>
            </div>
          )}
          {receiver && !isGroup && (
            <div className="flex items-center p-5 border-b border-gray-700 bg-gray-800">
              <img
                src={`http://localhost:5000/${receiver.name}`}
                alt=""
                className="w-[50px] h-[50px] rounded-full"
              />
              <div className="flex flex-col">
                <p className="text-white ml-3">{receiver.name}</p>
              </div>
            </div>
          )}
          <ul className="flex-1 overflow-y-auto p-2 flex flex-col relative">
            {isGroup ? (
              groupMessages.length > 0 ? (
                groupMessages.map((message, index) => (
                  <GroupMessageBox
                    key={index}
                    message={message}
                    isSender={message.senderId._id === decode.id}
                  />
                ))
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-white">
                    {isGroup ? "No group messages yet" : "No messages yet"}
                  </p>
                </div>
              )
            ) : messages.length > 0 ? (
              messages.map((message, index) => (
                <MessageBox
                  key={index}
                  message={message}
                  isSender={message.senderId === decode.id}
                />
              ))
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-white">
                  {isGroup ? "No group messages yet" : "No messages yet"}
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </ul>

          <form
            onSubmit={isGroup ? handleGroupForm : handleForm}
            className="flex items-center justify-between p-5 border-t border-gray-700"
          >
            <input
              type="text"
              value={message}
              onChange={isGroup ? handleGroupMessage : handleMessage}
              placeholder="Type a message"
              className={`w-full p-2 rounded-lg ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200"
              }`}
            />
            <button
              type="submit"
              className={`ml-2 p-2 rounded-lg ${
                isDarkMode ? "bg-blue-500" : "bg-blue-700"
              } text-white`}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
