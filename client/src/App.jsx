import React from "react";
import "./App.css";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { BrowserRouter as Routers, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Routers>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route
          path="*"
          element={
            <div className="h-screen bg-gray-300 text-white m-auto">
              <p>Page Not Found</p>
            </div>
          }
        />
      </Routes>
    </Routers>
  );
};

export default App;
