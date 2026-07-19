import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";


function Dashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] =useState(false);

  useEffect(() => {
    fetchTomorrow();
  }, []);

  // const fetchTomorrow = async () => {
  //   try {
  //     const res = await api.get("/appointments/tomorrow");
  //     setAppointments(res.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  const fetchTomorrow = async () => {
      setLoading(true);
      setError("");

      try {
          const res = await api.get("/appointments/tomorrow");
          setAppointments(res.data);
      } catch (err) {
          console.error(err);

          if (!err.response) {
              setError("Unable to connect to the server.");
          } else if (err.response.status === 401) {
              setError("Session expired. Please login again.");
          } else {
              setError("Unable to load tomorrow's appointments.");
          }
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">


      {/* 🔷 TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        {/* REGISTER CARD */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="bg-blue-50 rounded-xl p-6 flex flex-col items-center">
            
            {/* ICON */}
            <div className="bg-blue-200 p-3 rounded-full mb-4 text-xl">
              👤
            </div>

            {/* BUTTON */}
            <button
              onClick={() => navigate("/compounder/register")}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium"
            >
              Register New Patient
            </button>
          </div>
        </div>

        {/* VIEW PATIENT CARD */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center">
            
            <div className="bg-green-200 p-3 rounded-full mb-4 text-xl">
              👥
            </div>

            <button
              onClick={() => navigate("/compounder/reappointment")}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-medium"
            >
              View Existing Patients
            </button>
          </div>
        </div>

      </div>
{error && (
    <div className="mb-4 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700">
        {error}
    </div>
)}
{loading && (
    <div className="mb-4 rounded-lg bg-blue-100 border border-blue-300 px-4 py-3 text-blue-700">
        Loading tomorrow's appointments...
    </div>
)}
      {/* 🔷 TABLE SECTION */}
      <div className="bg-white rounded-2xl shadow-md p-6">

        <h2 className="text-lg font-semibold mb-4">
          Tomorrow's Appointments
        </h2>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm">
              <th className="p-2">Patient ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Doctor</th>
              <th className="p-2">Time</th>
            </tr>
          </thead>

          {/* <tbody>
            {appointments.map((a) => (
              <tr key={a.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{a.patient_code}</td>
                <td className="p-2">{a.patient_name}</td>
                <td className="p-2">{a.patient_phone}</td>
                <td className="p-2">{a.doctor_name}</td>
                <td className="p-2">{a.time}</td>
              </tr>
            ))}
          </tbody>
          
          */}

<tbody>
  {!loading && !error && appointments.length === 0 ? (
    <tr>
      <td
        colSpan={5}
        className="p-6 text-center text-gray-500"
      >
        No appointments scheduled for tomorrow.
      </td>
    </tr>
  ) : (
    appointments.map((a) => (
      <tr key={a.id} className="border-b hover:bg-gray-50">
        <td className="p-2">{a.patient_code}</td>
        <td className="p-2">{a.patient_name}</td>
        <td className="p-2">{a.patient_phone}</td>
        <td className="p-2">{a.doctor_name}</td>
        <td className="p-2">{a.time}</td>
      </tr>
    ))
  )}
</tbody>

        </table>

        {/* VIEW ALL BUTTON */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate("/compounder/tomorrow")}
            className="flex items-center gap-2 border font-bold border-blue-500 text-blue-600 px-5 py-2 rounded-lg hover:bg-blue-50"
          >
             Tomorrow's Appointments
          </button>
        {/* </div>
        <div className="flex justify-center mt-6"> */}
          <button
            onClick={() => navigate("/compounder/followUp")}
            className="flex items-center gap-2 border font-bold border-blue-500 text-blue-600 px-5 py-2 rounded-lg hover:bg-blue-50"
          >
             Follow-Up Patients
          </button>
        </div>

      </div>

    </div>
  );

}

export default Dashboard;