import { useEffect, useState } from "react";
import api from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";

function AdminPanel() {
  const navigate = useNavigate(); 
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState({ name: "", type: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    const res = await api.get("/medicines/");
    setMedicines(res.data);
  };

  // ➕ Add / Update
  const handleSubmit = async () => {
    try {
      if (editId) {
        await api.put(`/medicines/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/medicines/", form);
      }

      setForm({ name: "", type: "" });
      fetchMedicines();

    } catch {
      alert("Error ❌");
    }
  };

  // ✏️ Edit
  const handleEdit = (med) => {
    setForm({ name: med.name, type: med.type });
    setEditId(med.id);
  };

  // ❌ Delete
  const handleDelete = async (id) => {
    if (!confirm("Delete this medicine?")) return;

    await api.delete(`/medicines/${id}`);
    fetchMedicines();
  };

  return (
  <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen space-y-6">

    {/* 🔹 HEADER */}
    <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow">

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/doctor")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow"
        >
          ← Back
        </button>

        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Medicine Management
          </h1>
          <p className="text-sm text-gray-500">
            Add, update and manage medicines
          </p>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        Total: <b>{medicines.length}</b>
      </div>
    </div>

    {/* 🔹 FORM CARD */}
    <div className="bg-white p-5 rounded-xl shadow flex flex-col md:flex-row gap-4 items-center">

      <input
        placeholder="Medicine Name"
        className="border rounded-xl p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <select
        className="border rounded-xl p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      >
        <option value="">Select Type</option>
        <option value="tablet">Tablet</option>
        <option value="syrup">Syrup</option>
        <option value="eye_drop">Eye Drop</option>
        <option value="capsules">Capsules</option>
        <option value="ointment">Ointment</option>
        <option value="eye_wipes">Eye Wipes</option>

      </select>

      <button
        onClick={handleSubmit}
        className={`px-6 py-2.5 rounded-xl text-white shadow transition ${
          editId
            ? "bg-yellow-500 hover:bg-yellow-600"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {editId ? "Update" : "Add "}
      </button>
    </div>

    {/* 🔹 TABLE CARD */}
    <div className="bg-white rounded-xl shadow overflow-hidden">

      <div className="p-4 border-b font-semibold text-gray-700">
        Medicine List
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Medicine Name</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {medicines.map((m, index) => (
              <tr
                key={m.id}
                className="border-t hover:bg-blue-50 transition"
              >
                <td className="p-3">{index + 1}</td>

                <td className="p-3 font-medium text-gray-800">
                  {m.name}
                </td>

                <td className="p-3">
                  <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                    {m.type}
                  </span>
                </td>

                <td className="p-3 flex gap-2">

                  <button
                    onClick={() => handleEdit(m)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(m.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}

            {medicines.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-400">
                  No medicines found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  </div>
);
}

export default AdminPanel;