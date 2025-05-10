import { useState } from "react";
import LoadingUi from "../Ui's/LoadingUi.jsx";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
export default function Login() {
  const [userDetails, setUserDetails] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const handleInput = (e) => {
    const { value, name } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    };
    const response = await fetch("http://localhost:5000/user/login", payload);
    const parsedResponse = await response.json();
    if (response.ok) {
      Cookie.set("jwtToken", parsedResponse.message);
      navigate("/");
    } else {
      setLoading(false);
      setErr(parsedResponse.message);
      // console.log("response");
    }

    // console.log(userDetails);
  };
  const content = () => {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={userDetails?.email}
              onChange={handleInput}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={userDetails?.password}
              onChange={handleInput}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full animate-scaleIn px-6 py-3 text-white font-bold rounded-lg bg-blue-600 shadow-lg"
          >
            Sign In
          </button>
          {err && <p className="text-red-600">{err}</p>}
        </form>

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <button onClick={()=>navigate("/register")} className="text-blue-600 hover:underline">
            Sign up
          </button>
        </p>
      </div>
    );
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {loading ? <LoadingUi /> : content()}
    </div>
  );
}
