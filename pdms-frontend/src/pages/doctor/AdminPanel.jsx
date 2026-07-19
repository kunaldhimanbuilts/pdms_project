import { useEffect, useState } from "react";
import api from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";

function AdminPanel() {
  const navigate = useNavigate(); 
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState({ name: "", type: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    type: "",
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  // const fetchMedicines = async () => {
  //   const res = await api.get("/medicines/");
  //   setMedicines(res.data);
  // };
  const fetchMedicines = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/medicines/");
      setMedicines(res.data);
    } 
    
    catch (err) {
      console.error("Fetch medicines failed:", err);

      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError("Your session has expired. Please login again.");
            break;

          case 404:
            setError("Medicine API not found.");
            break;

          case 500:
            setError("Server error. Please try again later.");
            break;

          default:
            setError("Failed to load medicines.");
        }
      } else {
        setError("Network error. Please check your internet connection.");
      }
    }    
    finally {
      setLoading(false);
    }
  };


  // ➕ Add / Update
  // const handleSubmit = async () => {
  //   try {
  //     if (editId) {
  //       await api.put(`/medicines/${editId}`, form);
  //       setEditId(null);
  //     } else {
  //       await api.post("/medicines/", form);
  //     }

  //     setForm({ name: "", type: "" });
  //     fetchMedicines();

  //   } catch {
  //     alert("Error ❌");
  //   }
  // };

  const validateForm = () => {
    const newErrors = {
      name: "",
      type: "",
    };

    let valid = true;

    const name = form.name.trim();

    if (!name) {
      newErrors.name = "Medicine name is required.";
      valid = false;
    } else if (name.length < 2) {
      newErrors.name = "Medicine name must be at least 2 characters.";
      valid = false;
    } else if (name.length > 100) {
      newErrors.name = "Medicine name cannot exceed 100 characters.";
      valid = false;
    }

    if (!form.type) {
      newErrors.type = "Please select a medicine type.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;


    const trimmedName = form.name.trim().toLowerCase();

    const duplicate = medicines.find(
      (m) =>
        m.name.trim().toLowerCase() === trimmedName &&
        m.id !== editId
    );

    if (duplicate) {
      setError("Medicine already exists.");
      setErrors((prev) => ({
        ...prev,
        name: "Medicine already exists.",
      }));
      return;
    }

    if (submitLoading) return;
    try {
      setSubmitLoading(true);
      setError("");
      const payload = {
        name: form.name.trim(),
        type: form.type,
      };
      if (editId) {
        await api.put(`/medicines/${editId}`, payload);
        setEditId(null);
      } else {
        await api.post("/medicines/", payload);
      }

      setForm({ name: "", type: "" });
      fetchMedicines();
    } 
    
    catch (err) {
      console.error("Save medicine failed:", err);

      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError("Invalid medicine details.");
            break;

          case 401:
            setError("Unauthorized. Please login again.");
            break;

          case 404:
            setError("Medicine not found.");
            break;

          case 409:
            setError("Medicine already exists.");
            break;

          case 500:
            setError("Server error. Please try again later.");
            break;

          default:
            setError("Failed to save medicine.");
        }
      } else {
        setError("Network error. Please check your internet connection.");
      }
    }    
    finally {
      setSubmitLoading(false);
    }
  };
  // ✏️ Edit
  const handleEdit = (med) => {
    setForm({ name: med.name, type: med.type });
    setEditId(med.id);
  };

  // ❌ Delete
  // const handleDelete = async (id) => {
  //   if (!confirm("Delete this medicine?")) return;

  //   await api.delete(`/medicines/${id}`);
  //   fetchMedicines();
  // };
  const handleDelete = async (id) => {
    if (!confirm("Delete this medicine?")) return;
    if (deleteLoading) return;

    try {
      setDeleteLoading(id);
      setError("");

      await api.delete(`/medicines/${id}`);
      fetchMedicines();
    } 
        
    catch (err) {
      console.error("Delete medicine failed:", err);

      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError("Unauthorized.");
            break;

          case 404:
            setError("Medicine not found.");
            break;

          case 500:
            setError("Server error.");
            break;
          case 409:
            setError(
              "Medicine is already used in prescriptions and cannot be deleted."
            );
            break;
          default:
            setError("Failed to delete medicine.");
        }
      } else {
        setError("Network error.");
      }
    }    
    finally {
      setDeleteLoading(null);
    }
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
    {error && (
      <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg">
        {error}
      </div>
    )}
    {/* 🔹 FORM CARD */}
    <div className="bg-white p-5 rounded-xl shadow flex flex-col md:flex-row gap-4 items-center">

      <input
        placeholder="Medicine Name"
        // className="border rounded-xl p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"

        className={`border rounded-xl p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          errors.name ? "border-red-500" : ""
        }`}

        value={form.name}
        // onChange={(e) => setForm({ ...form, name: e.target.value })}
        onChange={(e) => {
          setForm({
            ...form,
            name: e.target.value,
          });

          if (errors.name || error) {
            setErrors((prev) => ({
              ...prev,
              name: "",
            }));
            setError("");
          }
        }}

        
      />

      {errors.name && (
        <p className="text-red-500 text-sm mt-1">
          {errors.name}
        </p>
      )}


      <select
        className={`border rounded-xl p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          errors.type ? "border-red-500" : ""
        }`}        
        value={form.type}
        // onChange={(e) => setForm({ ...form, type: e.target.value })}
        onChange={(e) => {
          setForm({
            ...form,
            type: e.target.value,
          });

          if (errors.type) {
            setErrors((prev) => ({
              ...prev,
              type: "",
            }));
          }
        }}

      >
        <option value="">Select Type</option>
        <option value="tablet">Tablet</option>
        <option value="syrup">Syrup</option>
        <option value="eye_drop">Eye Drop</option>
        <option value="capsules">Capsules</option>
        <option value="ointment">Ointment</option>
        <option value="eye_wipes">Eye Wipes</option>
        <option value="shampoo">Shampoo</option>
        <option value="injection">Injection</option>

      </select>
      {errors.type && (
        <p className="text-red-500 text-sm mt-1">
          {errors.type}
        </p>
      )}
      {/* <button
        onClick={handleSubmit}
        className={`px-6 py-2.5 rounded-xl text-white shadow transition ${
          editId
            ? "bg-yellow-500 hover:bg-yellow-600"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {editId ? "Update" : "Add "}
      </button> */}
      <button
        onClick={handleSubmit}
        disabled={submitLoading}
        className={`px-6 py-2.5 rounded-xl text-white shadow transition ${
          editId
            ? "bg-yellow-500 hover:bg-yellow-600"
            : "bg-blue-600 hover:bg-blue-700"
        } ${
          submitLoading
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        {submitLoading
          ? (editId ? "Updating..." : "Adding...")
          : (editId ? "Update" : "Add")}
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

                  {/* <button
                    onClick={() => handleDelete(m.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button> */}
                  <button
                    onClick={() => handleDelete(m.id)}
                    disabled={deleteLoading === m.id}
                    className={`px-3 py-1 rounded-lg text-white ${
                      deleteLoading === m.id
                        ? "bg-red-300 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {deleteLoading === m.id ? "Deleting..." : "Delete"}
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

          {/* <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center p-6">
                  Loading medicines...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4" className="text-center p-6 text-red-500">
                  {error}
                </td>
              </tr>
            ) : medicines.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-500">
                  No medicines found.
                </td>
              </tr>
            ) : (
              medicines.map((m, index) => (
                
              ))
            )}
          </tbody> */}


        </table>
      </div>
    </div>
  </div>
);
}

export default AdminPanel;