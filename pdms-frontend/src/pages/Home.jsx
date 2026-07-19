import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import logo from "../assets/logo.png";
import logo2 from "../assets/logo2.png"; // text logo

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_patients: 0,
    today_appointments: 0,
    active_doctors: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   const fetchStats = async () => {
  //     try {
  //       const res = await api.get("/dashboard/stats");
  //       setStats(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   fetchStats();
  // }, []);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await api.get("/dashboard/stats");
        setStats(res.data);
      } catch (err) {
        console.error(err);

        if (!err.response) {
          setError("Unable to connect to the server.");
        } else {
          setError("Unable to load dashboard.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);


  return (
    // <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-green-100 p-6 flex justify-center items-center">
      
    //   <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-green-100">

      <div className="w-full bg-white">
        {/* 🔷 HEADER */}
        <div className="flex items-center px-6 py-4 border-b bg-gray-50">
          <img src={logo} alt="logo" className="h-12" />
          <img src={logo2} alt="logo2" className="h-12" />
          {loading && (
            <div className="mx-auto max-w-5xl mb-4 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700">
              <p >Loading dashboard...</p>
            </div>
          )}
          {error && (
            <div className="mx-auto max-w-5xl mb-4 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

        </div>

        {/* 🔷 HERO SECTION */}
        <div className="flex justify-between items-center px-10 pt-12 pb-24 bg-gradient-to-r from-blue-200 via-blue-100 to-green-200">
          
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome to <span className="text-blue-700">S&D Eyecare PDMS</span>
            </h2>

            <p className="text-gray-600 mb-6">
              Manage patient records, appointments and diagnosis efficiently in one place.
            </p>

            <h3 className="text-xl font-semibold mb-2">System Overview</h3>
            <p className="text-gray-600">
              A complete system for managing hospital workflows including patients,
              appointments and prescriptions.
            </p>
          </div>

          {/* RIGHT IMAGE (optional illustration) */}
          <div className="hidden md:block">
            {/* <img
              src="https://cdn-icons-png.flaticon.com/512/2966/2966484.png"
              alt="doctor"
              className="h-48 opacity-90"
            /> */}
            <div className="h-60">
              <svg
                viewBox="0 0 800 500"
                className="h-full w-auto"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background */}
                {/* <rect width="800" height="500" fill="#eaf3f5"/> */}

                {/* Monitor */}
                <rect x="200" y="100" width="400" height="250" rx="12" fill="#ffffff" stroke="#cfd8dc" strokeWidth="2"/>
                <rect x="250" y="140" width="300" height="20" rx="5" fill="#90caf9"/>
                <rect x="250" y="180" width="200" height="15" rx="4" fill="#cfd8dc"/>
                <rect x="250" y="210" width="250" height="15" rx="4" fill="#cfd8dc"/>
                <rect x="250" y="240" width="180" height="15" rx="4" fill="#cfd8dc"/>

                {/* Avatar */}
                <circle cx="450" cy="180" r="30" fill="#64b5f6"/>
                <circle cx="450" cy="170" r="10" fill="#ffffff"/>
                <rect x="435" y="180" width="30" height="15" rx="8" fill="#ffffff"/>

                {/* Magnifier */}
                <circle cx="580" cy="200" r="50" fill="none" stroke="#1e3a5f" strokeWidth="6"/>
                <line x1="610" y1="230" x2="670" y2="290" stroke="#1e3a5f" strokeWidth="8" strokeLinecap="round"/>
              </svg>
            </div>

          </div>
        </div>

        {/* 🔷 STATS */}
        {/* <div className="grid grid-cols-3 gap-6 px-10 -mt-16 relative z-10"> */}
        {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-16 -mt-20 relative z-10 max-w-5xl mx-auto">
          
          {/* <div className="bg-white rounded-xl shadow-md p-5 flex justify-between items-center"> */}
          <div className="bg-white rounded-xl shadow-md px-6 py-5 flex justify-between items-center min-h-[90px]">
            <div>
              <p className="text-gray-900 text-l font-bold">Total Patients</p>
              <h2 className="text-3xl font-bold">{stats.total_patients}</h2>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">👥</div>
          </div>

          {/* <div className="bg-white rounded-xl shadow-md p-5 flex justify-between items-center"> */}
          <div className="bg-white rounded-xl shadow-md px-6 py-5 flex justify-between items-center min-h-[90px]">
            <div>
              <p className="text-gray-900 text-l font-bold">Today's Appointments</p>
              <h2 className="text-3xl font-bold">{stats.today_appointments}</h2>
            </div>
            <div className="bg-green-100 p-3 rounded-full">📅</div>
          </div>

          {/* <div className="bg-white rounded-xl shadow-md p-5 flex justify-between items-center"> */}
          <div className="bg-white rounded-xl shadow-md px-6 py-5 flex justify-between items-center min-h-[90px]">
            <div>
              <p className="text-gray-900 text-l font-bold">Active Doctors</p>
              <h2 className="text-3xl font-bold">{stats.active_doctors}</h2>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">🩺</div>
          </div>

        </div>
        )}

        {/* 🔷 LOGIN CARDS */}
        {/* <div className="grid grid-cols-3 gap-8 px-10 pb-10"> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-16 py-10 max-w-5xl mx-auto">
          
          <div
            onClick={() => navigate("/login/compounder")}
            // className="cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 text-white p-8 rounded-xl shadow-lg text-center hover:scale-105 transition"
            className="cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-10 rounded-xl shadow-lg text-center hover:scale-105 transition min-h-[160px] flex flex-col justify-center"
          >
            <h3 className="text-xl font-semibold mb-2">Compounder Login</h3>
            <p className="text-sm opacity-90">Login as Compounder</p>
          </div>

          <div
            onClick={() => navigate("/login/doctor")}
            // className="cursor-pointer bg-gradient-to-r from-cyan-500 to-teal-600 text-white p-8 rounded-xl shadow-lg text-center hover:scale-105 transition"
            className="cursor-pointer bg-[#51a2ff] text-white px-6 py-10 rounded-xl shadow-lg text-center hover:scale-105 transition min-h-[160px] flex flex-col justify-center"
          >
            <h3 className="text-xl font-semibold mb-2">Doctor Login</h3>
            <p className="text-sm opacity-90">Secure access for doctors</p>
          </div>

          <div
            onClick={() => navigate("/login/admin")}
            // className="cursor-pointer bg-gradient-to-r from-green-500 to-green-700 text-white p-8 rounded-xl shadow-lg text-center hover:scale-105 transition"
            className="cursor-pointer bg-[#00bba7] text-white px-6 py-10 rounded-xl shadow-lg text-center hover:scale-105 transition min-h-[160px] flex flex-col justify-center"
          >
            <h3 className="text-xl font-semibold mb-2">Admin Access</h3>
            <p className="text-sm opacity-90">All patients data</p>
          </div>

        </div>

      </div>
    </div>
  );
}