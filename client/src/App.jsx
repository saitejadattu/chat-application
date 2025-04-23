import React from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import { BrowserRouter as Routers, Route,Routes } from "react-router-dom";
const App = () => {
  return (
    <Routers>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
