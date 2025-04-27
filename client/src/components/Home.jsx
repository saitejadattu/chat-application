import React, { useState, useEffect } from "react";
import LoadingUi from "../Ui's/LoadingUi.jsx";
import NavBar from "./NavBar.jsx";
import { io } from "socket.io-client";

const Home = () => {
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // console.log(socket);
  const [textList, setTextList] = useState([]);
  const [text, setText] = useState("");
  const handleInput = (e) => {
    setText(e.target.value);
  };
  const handleSend = (e) => {
    e.preventDefault();
    setTextList((prev) => [...prev, text]);
    setText("");
  };
  useEffect(() => {
    // Load messages from database
    const socket = io("http://localhost:5000");
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/api/messages");
      console.log(response);
    };

    fetchData();
    // Listen for new messages
    socket.on("receive_message", (data) => {
      console.log(data);
      // setMessages((prev) => [...prev, data]);
    });

    // Cleanup on unmount
    return () => socket.off("receive_message");
  }, []);
  // console.log(window.matchMedia("(prefers-color-scheme: dark)").matches);
  return (
    <div className={`h-screen ${isDarkMode ? "bg-black" : "bg-white"}`}>
      <NavBar />
      <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg flex flex-col h-[500px] border border-gray-200">
        <ul className="flex-1 overflow-y-auto p-4 space-y-2">
          {textList.map((msg, index) => (
            <li
              key={index}
              className="bg-blue-100 text-blue-900 p-2 rounded-md max-w-[75%] self-start"
            >
              {msg}
            </li>
          ))}
        </ul>

        <div className="p-4 border-t border-gray-200 flex">
          <input
            type="text"
            value={text}
            onChange={handleInput}
            // onKeyDown={handleInput}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
