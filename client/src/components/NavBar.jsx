import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
const NavBar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    Cookie.remove("jwtToken");
    navigate("/login");
  };

  return (
    <div className="p-3 flex justify-between h-16 items-center bg-green-400 text-white">
      <Link className="" to="/">
        Meet
      </Link>
      <button
        className="animate-scaleIn px-6 py-3 font-bold rounded-lg bg-blue-600 shadow-lg"
        onClick={handleLogout}
      >
        logout
      </button>
    </div>
  );
};

export default NavBar;
