import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const pending = appointments.filter(a => a.status === "pending").length;
  const completed = appointments.filter(a => a.status === "completed").length;
  const cancelled = appointments.filter(a => a.status === "cancelled").length;

  // useEffect(() => {
  //   fetchToday();
  // }, []);

  useEffect(() => {
    fetchToday();

    const interval = setInterval(fetchToday, 30000); // 30 sec

    return () => clearInterval(interval);
  }, []);  
  useEffect(() => {
    if (id) {
      setSearchCode(id);   // 🔥 important for UI input
      handleSearch(id);
    }
  }, [id]);
  const fetchToday = async () => {
    try {
      const res = await api.get("/appointments/todays");
      setAppointments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // return (
  //   <div>
  //     <h1 className="text-2xl font-bold text-blue-700 mb-6">
  //       Doctor Dashboard
  //     </h1>

  //     {/* Stats Cards */}
  //     {/* <div className="grid grid-cols-3 gap-6 mb-8">

  //       <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-xl shadow">
  //         <h2 className="text-lg">Today Patients</h2>
  //         <p className="text-2xl font-bold">{appointments.length}</p>
  //       </div>

  //       <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-xl shadow">
  //         <h2 className="text-lg">Total Appointments</h2>
  //         <p className="text-2xl font-bold">{appointments.length}</p>
  //       </div>

  //       <div className="bg-gradient-to-r from-red-400 to-red-600 text-white p-6 rounded-xl shadow">
  //         <h2 className="text-lg">Pending Cases</h2>
  //         <p className="text-2xl font-bold">{appointments.length}</p>
  //       </div>

  //     </div>   */}
  //     <div className="grid grid-cols-3 gap-6 mb-8">

  //       <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-xl shadow">
  //         <h2 className="text-lg">Today Patients</h2>
  //         <p className="text-2xl font-bold">{appointments.length}</p>
  //       </div>

  //       <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-xl shadow">
  //         <h2 className="text-lg">Completed</h2>
  //         <p className="text-2xl font-bold">{completed}</p>
  //       </div>

  //       <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-6 rounded-xl shadow">
  //         <h2 className="text-lg">Pending</h2>
  //         <p className="text-2xl font-bold">{pending}</p>
  //       </div>

  //       {/* Optional 4th card */}
  //       {/* <div className="bg-gradient-to-r from-red-400 to-red-600 text-white p-6 rounded-xl shadow">
  //         <h2 className="text-lg">Cancelled</h2>
  //         <p className="text-2xl font-bold">{cancelled}</p>
  //       </div> */}

  //     </div>

      

  //     {/* Action Cards */}
  //     <div className="grid grid-cols-2 gap-6 mb-8">

  //       <div
  //         onClick={() => navigate("/doctor/diagnosis")}
  //         className="cursor-pointer bg-white p-6 rounded-xl shadow hover:shadow-lg"
  //       >
  //         <h2 className="text-lg font-semibold">Diagnosis Panel</h2>
  //         <p className="text-sm text-gray-500 mt-2">
  //           Diagnose patients & prescriptions
  //         </p>
  //       </div>

  //       <div
  //         onClick={() => navigate("/doctor/admin")}
  //         className="cursor-pointer bg-white p-6 rounded-xl shadow hover:shadow-lg"
  //       >
  //         <h2 className="text-lg font-semibold">Doctor Admin Panel</h2>
  //         <p className="text-sm text-gray-500 mt-2">
  //           Manage medicines
  //         </p>
  //       </div>

  //     </div>

  //     {/* Today Appointments */}
  //     <div className="bg-white p-6 rounded-xl shadow">
  //       <h2 className="font-semibold mb-4">Today Appointments</h2>

  //       <table className="w-full text-left">
  //         <thead>
  //           <tr className="border-b">
  //             {/* <th className="p-2">Patient ID</th> */}
  //             <th className="p-2">Patient Code</th>
  //             <th className="p-2">Patient Name</th>
  //             <th className="p-2">Time</th>
  //             <th className="p-2">Status</th>
  //           </tr>
  //         </thead>

  //         <tbody>
  //           {appointments.map((a) => (
  //             <tr key={a.id} className="border-b">
  //               {/* <td className="p-2">{a.patient_id}</td> */}
  //               <td className="p-2">{a.patient_code}</td>
  //               <td className="p-2">{a.patient_name}</td>
  //               <td className="p-2">{a.time}</td>
  //               {/* <td className="p-2">{a.status}</td> */}
  //               <td className="p-2">
  //                 <span className={
  //                   a.status === "completed" ? "text-green-600 font-semibold" :
  //                   a.status === "cancelled" ? "text-red-600 font-semibold" :
  //                   "text-yellow-600 font-semibold"
  //                 }>
  //                   {a.status}
  //                 </span>
  //               </td>

  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //   </div>
  // );

  return (
    // <div className="min-h-screen bg-gray-100">
    <div className="min-h-screen bg-gray-100 px-6 md:px-10">

      {/* 🔷 HERO */}
      <div className="bg-gradient-to-r from-blue-200 via-blue-100 to-green-200 rounded-xl pt-10 pb-20 px-8 md:px-10 mt-4">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Doctor Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage diagnosis, prescriptions and system controls efficiently.
            </p>
          </div>

          {/* Illustration */}
          <img
            src="https://cdn-icons-png.flaticon.com/512/4140/4140037.png"
            className="h-40 opacity-90"
          />
        </div>
      </div>

      {/* 🔷 STATS (FLOATING) */}
      <div className="grid grid-cols-3 gap-6 px-10 -mt-10 mb-10">

        <div className="bg-white p-5 rounded-xl shadow-md flex justify-between items-center">
          <div>
            <p className="text-gray-900 text-l font-bold">Today's Patients</p>
            <h2 className="text-2xl font-bold">{appointments.length}</h2>
            <p className="text-xs text-gray-400">Patients Seen Today</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">👥</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md flex justify-between items-center">
          <div>
            <p className="text-gray-900 text-l font-bold">Completed</p>
            <h2 className="text-2xl font-bold">{completed}</h2>
            <p className="text-xs text-gray-400">Completed Appointments</p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">📅</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md flex justify-between items-center">
          <div>
            <p className="text-gray-900 text-l font-bold">Pending Cases</p>
            <h2 className="text-2xl font-bold">{pending}</h2>
            <p className="text-xs text-gray-400">Awaiting Follow-up</p>
          </div>
          <div className="bg-red-100 p-3 rounded-full">📋</div>
        </div>

      </div>

      {/* 🔷 ACTION CARDS */}
      <div className="grid grid-cols-2 gap-6 px-10 mb-10">

        {/* Diagnosis */}
        {/* <div
          onClick={() => navigate("/doctor/diagnosis")}
          className="cursor-pointer bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-xl shadow-lg hover:scale-[1.02] transition"
        >
          <h2 className="text-xl font-semibold mb-2">Diagnosis Panel</h2>
          <p className="text-sm opacity-90 mb-4">
            Search patients, view history and create prescriptions.
          </p>

          <button className="bg-white text-blue-700 px-4 py-2 rounded">
            Start Diagnosis →
          </button>
        </div> */}
        <div
          onClick={() => navigate("/diagnosis-v2")}
          className="cursor-pointer bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-xl shadow-lg hover:scale-[1.02] transition"
        >
          <h2 className="text-xl font-semibold mb-2">Diagnosis Panel</h2>
          <p className="text-sm opacity-90 mb-4">
            Search patients, view history and create prescriptions.
          </p>

          <button className="bg-white text-blue-700 px-4 py-2 rounded">
            Start Diagnosis →
          </button>
        </div>



        {/* Admin */}
        <div
          onClick={() => navigate("/doctor/admin")}
          className="cursor-pointer bg-gradient-to-r from-green-500 to-green-700 text-white p-8 rounded-xl shadow-lg hover:scale-[1.02] transition"
        >
          <h2 className="text-xl font-semibold mb-2">Doctor Admin Panel</h2>
          <p className="text-sm opacity-90 mb-4">
            Manage medicines, eye drops, syrups and diagnosis data.
          </p>

          <button className="bg-white text-green-700 px-4 py-2 rounded">
            Open Admin Panel →
          </button>
        </div>

      </div>

      {/* 🔷 TABLE */}
      <div className="px-10 pb-10">
        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="font-semibold mb-4 text-gray-700">
            Today's Appointments
          </h2>

          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm">
                <th className="p-3">Patient</th>
                <th className="p-3">Patient ID</th>
                <th className="p-3">Time</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((a) => (
                <tr 
                 key={a.id} 
                 onClick={() => navigate(`/diagnosis-v2/${a.patient_code}`)}
                 className="border-b hover:bg-blue-50 cursor-pointer transition"
                >
                  <td className="p-3">{a.patient_name}</td>
                  <td className="p-3">{a.patient_code}</td>
                  <td className="p-3">{a.time}</td>

                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      a.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : a.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {a.status}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>

    </div>
  );

}

export default DoctorDashboard;