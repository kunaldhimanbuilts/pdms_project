import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

function Patients() {
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 20;
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  

  useEffect(() => {
    fetchPatients();
  }, []);

  // const fetchPatients = async () => {
  //   const res = await api.get("/admin/patients");
  //   setPatients(res.data);
  // };
  const fetchPatients = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/admin/patients");
      setPatients(res.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load patients.");
    } finally {
      setLoading(false);
    }
  };


  // 🔍 Search
  const handleSearch = async () => {

    if (!search.trim()) {
      setError("Please enter Patient ID, Name or Phone.");
      return;
    }

    setError("");

    setLoading(true);

    try {
      const res = await api.get(`/admin/patients/search/${search}`);
      setPatients(res.data);
    } 
    catch (err) {
      console.error(err);

      setError("Patient not found.");
    }


    finally {
      setLoading(false);
    }

  };
  const indexOfLast = currentPage * patientsPerPage;
  const indexOfFirst = indexOfLast - patientsPerPage;

  const currentPatients = patients.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(patients.length / patientsPerPage);

  const handleReset = () => {
    setSearch("");
    setError("");
    setCurrentPage(1);
    fetchPatients();
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold text-gray-800">
          Patients
        </h1>

        <div className="flex gap-3">

          <input
            placeholder="Search by ID/Name/Phone"
            className="px-14 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Search
          </button>

          <button
            
            onClick={handleReset}
            disabled={loading}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Reset
          </button>

        </div>

      </div>  

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 border border-red-300 text-red-700 px-4 py-2">
          {error}
        </div>
      )}
          
      {loading && (
        <p className="text-blue-600 mb-4">
          Loading patients...
        </p>
      )}
      {/* Table */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <table className="w-full text-left border-collapse">

          {/* <thead>
            <tr className="border-b">
              <th className="p-2">Patient ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Address</th>
              <th className="p-2">Action</th>
            </tr>
          </thead> */}
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
            <tr>
              <th className="p-3">Patient ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Address</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* {patients.map((p) => ( */}
            {currentPatients.map((p) => (
              // <tr key={p.id} className="border-b">
              //   <td className="p-2">{p.patient_code}</td>
              //   <td className="p-2">{p.name}</td>
              //   <td className="p-2">{p.phone}</td>
              //   <td className="p-2">{p.address}</td>

              //   <td className="p-2">
              //     <button
              //       onClick={() => navigate(`/admin/patient/${p.id}`)}
              //       className="bg-green-600 text-white px-3 py-1 rounded"
              //     >
              //       View Details
              //     </button>
              //   </td>
              // </tr>

              <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3 font-medium text-blue-700">
                  {p.patient_code}
                </td>

                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.phone}</td>
                <td className="p-3">{p.address}</td>

                <td className="p-3 text-center">
                  <button
                    onClick={() => navigate(`/admin/patient/${p.id}`)}
                    className="bg-green-500 text-white px-4 py-1 rounded-lg shadow hover:bg-green-600 transition"
                  >
                    View
                  </button>
                </td>
              </tr>


            ))}
          </tbody>

          


        </table>
        <div className="flex justify-between items-center mt-4">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
}

export default Patients;