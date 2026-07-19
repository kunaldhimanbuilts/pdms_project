import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../../services/api";

export default function Login() {
  const { role } = useParams();
  const navigate = useNavigate();

  const emailRef = useRef();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Auto focus
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/login", {
        ...form,
        role
      });

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("doctor", JSON.stringify(res.data.user));

      navigate(`/${res.data.role}`);
    } 
    // catch {
    //   setError("Invalid credentials");


    catch (err) {
        console.error(err);

        if (!err.response) {
            setError("Unable to connect to the server.");
        } else if (err.response.status === 401) {
            setError("Invalid email or password.");
        } else {
            setError("Login failed. Please try again.");
        }
    }

    finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-white to-green-200 px-4">

      {/* 🔙 BACK */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 bg-white/70 backdrop-blur-md px-6 py-2 rounded-xl shadow hover:scale-105 transition"
      >
        Back
      </button>

      {/* 💎 GLASS CARD */}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-lg backdrop-blur-xl bg-white/30 border border-white/40 shadow-2xl rounded-3xl p-10 transition-all duration-300 hover:scale-[1.01]"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 capitalize">
          {role} Login
        </h2>

        {/* ❌ ERROR */}
        {error && (
          <div className="mb-4 text-red-600 text-sm text-center font-medium">
            {error}
          </div>
        )}

        {/* 📧 EMAIL */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            {role} Email
          </label>

          <div className="flex items-center bg-white/60 border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400 transition">
            <span className="mr-2">👤</span>
            <input
              ref={emailRef}
              type="text"
              placeholder={`Enter ${role} Email`}
              className="w-full bg-transparent outline-none"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }

              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  document.getElementById("password").focus();
                }
              }}  

            />
          </div>
        </div>

        {/* 🔒 PASSWORD */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Password
          </label>

          <div className="flex items-center bg-white/60 border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400 transition">
            <span className="mr-2">🔒</span>
            <input
              id="password"
              type="password"
              placeholder="Enter Password"
              className="w-full bg-transparent outline-none"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>
        </div>

        {/* 🚀 LOGIN BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-800 hover:scale-[1.02]"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* 🔗 FORGOT */}
        <p className="text-center text-sm text-blue-700 mt-4 cursor-pointer hover:underline">
          Forgot your password?
        </p>
      </form>
    </div>
  );
}