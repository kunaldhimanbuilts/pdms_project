// import { useParams, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import api from "../../services/api";

// export default function Login() {
//   const { role } = useParams();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: "",
//     password: ""
//   });

//   const handleLogin = async () => {
//     try {
//       const res = await api.post("/auth/login", {
//         ...form,
//         role
//       });

//       localStorage.setItem("token", res.data.access_token);
//       localStorage.setItem("role", res.data.role);

//       navigate(`/${res.data.role}`);
//     } catch {
//       alert("Login failed");
//     }
//   };

//   const handleEnterNext = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();

//       const form = e.target.form;
//       const elements = Array.from(form.elements);

//       const index = elements.indexOf(e.target);

//       if (index === elements.length - 1) {
//         handleLogin(); // 🔥 LAST FIELD → LOGIN
//       } else {
//         elements[index + 1].focus(); // move next
//       }
//     }
//   };
//   return (
//     <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-green-100 flex items-center justify-center relative px-4">

//       {/* 🔙 BACK BUTTON */}
//       <button
//         onClick={() => navigate("/")}
//         className="absolute top-6 left-6 bg-white px-8 py-3 rounded-lg text-l shadow font-bold text-grey-800 hover:bg-gray-100"
//       >
//         Back
//       </button>

//       {/* 🔷 LOGIN CARD */}
//       <form className="bg-white rounded-2xl shadow-xl w-full max-w-md md:max-w-lg p-10" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
//         <div >

//           <h2 className="text-2xl font-bold text-center text-gray-800 mb-8 capitalize">
//             {role} Login
//           </h2>

//           {/* EMAIL */}
//           <div className="mb-5">
//             <label className="block text-sm font-bold text-gray-800 mb-1 capitalize">
//               {role} Email
//             </label>

//             <div className="flex items-center border rounded-lg px-3 py-2">
//               <span className="mr-2 text-gray-400">👤</span>
//               <input
//                 type="text"
//                 placeholder={`Enter ${role} Email`}
//                 className="w-full outline-none"
//                 onChange={(e) => setForm({ ...form, email: e.target.value })}
//                 onKeyDown={handleEnterNext}
//               />
//             </div>
//           </div>

//           {/* PASSWORD */}
//           <div className="mb-6">
//             <label className="block text-sm font-bold text-gray-800 mb-1 capitalize">
//               Password
//             </label>

//             <div className="flex items-center border rounded-lg px-3 py-2">
//               <span className="mr-2 text-gray-400">🔒</span>
//               <input
//                 type="password"
//                 placeholder="Enter Password"
//                 className="w-full outline-none"
//                 onChange={(e) => setForm({ ...form, password: e.target.value })}
//                 onKeyDown={handleEnterNext}
//               />
//               {/* <span className="text-gray-400 cursor-pointer">👁️</span> */}
//             </div>
//           </div>

//           {/* LOGIN BUTTON */}
//           <button
            
//             type="submit"
//             className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
//           >
//             Login
//           </button>

//           {/* FORGOT PASSWORD */}
//           <p className="text-center text-sm text-blue-600 mt-4 cursor-pointer hover:underline">
//             Forgot your password?
//           </p>

//         </div>
//       </form>
//     </div>
//   );

// }

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

  // const handleLogin = async (e) => {
  //   e.preventDefault();

  //   // ✅ Validation
  //   if (!form.email || !form.password) {
  //     setError("Please fill all fields");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     setError("");

  //     const res = await api.post("/auth/login", {
  //       ...form,
  //       role
  //     });

  //     localStorage.setItem("token", res.data.access_token);
  //     localStorage.setItem("role", res.data.role);

  //     navigate(`/${res.data.role}`);
  //   } catch {
  //     setError("Invalid credentials");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
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

      navigate(`/${res.data.role}`);
    } catch {
      setError("Invalid credentials");
    } finally {
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