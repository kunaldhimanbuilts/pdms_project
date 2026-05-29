import { useState, useEffect } from "react";
import api from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";

function Diagnosis() {
  const navigate = useNavigate(); 
  const [code, setCode] = useState("");
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [form, setForm] = useState({
    diagnosis_text: "",
    allergies: "",
    prescriptions: []
  });

  const handleSearch = async () => {
    try {
      const res = await api.get(`/patients/search/${code}`);
      setPatient(res.data);

      const hist = await api.get(`/diagnosis/patient/${res.data.id}`);
      setHistory(hist.data);

      // 🔥 NEW: fetch today's appointments
      const apptRes = await api.get("/appointments/todays");

      
      const found = apptRes.data.find(
        a => a.patient_id === res.data.id && a.status === "pending"
      );
      setSelectedAppointment(found);

    } catch {
      alert("Patient not found ❌");
    }
  };


  // 💊 Load medicines
  useEffect(() => {
    api.get("/medicines/").then(res => setMedicines(res.data));
  }, []);

  // ➕ Add prescription row
  const addPrescription = () => {
    setForm({
      ...form,
      prescriptions: [
        ...form.prescriptions,
        { medicine_name: "", type: "", dosage: "", duration: "", instructions: "" }
      ]
    });
  };

  // ✏️ Update prescription
  const updatePrescription = (index, field, value) => {
    const updated = [...form.prescriptions];
    updated[index][field] = value;
    setForm({ ...form, prescriptions: updated });
  };

  const handleSave = async () => {

    if (!selectedAppointment) {
      alert("No appointment found ❌");
      return;
    }

    try {
      await api.post("/diagnosis/", {
        patient_id: patient.id,
        // doctor_id: 2,
        appointment_id: selectedAppointment.id,
        ...form
      });

      alert("Diagnosis saved ✅");

    } catch {
      alert("Error ❌");
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return "—";

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-6 p-4 no-print">

        {/* 🔷 LEFT SIDE */}
        <div className="col-span-2 space-y-6">

          {/* 🔷 TOP BAR */}
          <div className="bg-white p-4 rounded-xl shadow flex items-center justify-between">

            
            <button
              onClick={() => navigate("/doctor")}
              className="bg-white px-4 py-2 rounded-lg font-bold text-grey-800 shadow hover:bg-gray-100 "
            >
            Back
            </button>
          
            <button
              onClick={() => {
                if (!patient) {
                  alert("No patient selected ❌");
                  return;
                }
                window.print();
              }}
              className="no-print"
            >
              🖨 Print
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Patient ID:</span>
              <input
                className="input w-48"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className="font-semibold text-gray-700"
              >
                GO
              </button>
            </div>

          </div>

          {/* 🔷 PATIENT INFO */}
          {patient && (
            // <div className="bg-blue-100 p-4 rounded-xl shadow text-sm text-gray-700">
            //   <p><b>Patient Name:</b> {patient.name}</p>
            //   <p><b>Age:</b> —</p>
            //   <p><b>Contact:</b> {patient.phone}</p>
            //   <p><b>Address:</b> —</p>
            // </div>

            <div className="bg-blue-100 p-4 rounded-xl shadow text-sm text-gray-700 grid grid-cols-2 gap-2">

              <p><b>Name:</b> {patient.name}</p>
              <p><b>Patient Code:</b> {patient.patient_code}</p>

              <p><b>Age:</b> {calculateAge(patient.dob)} yrs</p>
              <p><b>Gender:</b> {patient.gender}</p>

              <p><b>Blood Group:</b> {patient.blood_group}</p>
              <p><b>Marital Status:</b> {patient.marital_status}</p>

              <p><b>Contact:</b> {patient.phone}</p>
              <p><b>Emergency:</b> {patient.emergency_contact}</p>

              <p className="col-span-2">
                <b>Address:</b> {patient.address}
              </p>

            </div>

          )}
          {/* 🔷 APPOINTMENT STATUS */}
          {patient && selectedAppointment && (
            <div className="bg-yellow-100 border border-yellow-300 p-3 rounded-lg text-sm">
              <p><b>Appointment Time:</b> {selectedAppointment.time}</p>
              <p><b>Status:</b> {selectedAppointment.status}</p>
            </div>
          )}

          {patient && !selectedAppointment && (
            <div className="bg-red-100 border border-red-300 p-3 rounded-lg text-sm text-red-700">
              No active appointment found for today ❌
            </div>
          )}
          {/* 🔷 DIAGNOSIS + ALLERGIES */}
          {patient && (
            <div className="grid grid-cols-2 gap-4">

              <div className="bg-white p-4 rounded-xl shadow">
                <p className="font-medium mb-2">Diagnosis:</p>
                <textarea
                  className="input h-20"
                  onChange={(e) =>
                    setForm({ ...form, diagnosis_text: e.target.value })
                  }
                />
              </div>

              <div className="bg-white p-4 rounded-xl shadow">
                <p className="font-medium mb-2">Allergies:</p>
                <textarea
                  className="input h-20"
                  onChange={(e) =>
                    setForm({ ...form, allergies: e.target.value })
                  }
                />
              </div>

            </div>
          )}

          {/* 🔷 INPUT PANEL */}
          {patient && (
            
            <div className="bg-white p-4 rounded-xl shadow">

              <p className="font-semibold mb-4 text-gray-700">
                ○ Input Panel
              </p>

              {form.prescriptions.map((p, i) => (
                <div key={i} className="grid grid-cols-5 gap-3 mb-3">

                  {/* TYPE */}
                  <select
                    className="input"
                    onChange={(e) => updatePrescription(i, "type", e.target.value)}
                  >
                    <option value="">Type</option>
                    <option value="tablet">Tablet</option>
                    <option value="syrup">Syrup</option>
                    <option value="eye_drop">Eye Drop</option>
                  </select>

                  {/* MEDICINE */}
                  <select
                    className="input"
                    onChange={(e) => updatePrescription(i, "medicine_name", e.target.value)}
                  >
                    <option>Select Medicine</option>
                    {medicines
                      .filter(m => m.type === p.type)
                      .map(m => (
                        <option key={m.id}>{m.name}</option>
                      ))}
                  </select>

                  {/* DOSAGE */}
                  <input
                    placeholder="Dosage"
                    className="input"
                    onChange={(e) => updatePrescription(i, "dosage", e.target.value)}
                  />

                  {/* DURATION */}
                  <input
                    placeholder="Duration"
                    className="input"
                    onChange={(e) => updatePrescription(i, "duration", e.target.value)}
                  />

                  {/* INSTRUCTIONS */}
                  <input
                    placeholder="Instructions"
                    className="input"
                    onChange={(e) => updatePrescription(i, "instructions", e.target.value)}
                  />

                </div>
              ))}

              <button
                onClick={addPrescription}
                className="bg-green-500 text-white px-3 py-1 rounded mb-3"
              >
                + Add Medicine
              </button>

              {/* SAVE BUTTON */}
              <button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 rounded-lg"
              >
                Save
              </button>

            </div>          
          )}

        </div>

        
        {/* 🔷 RIGHT SIDE HISTORY */}
        <div className="bg-white rounded-xl shadow-md p-4 h-[80vh] overflow-y-auto">

          <h2 className="font-semibold mb-4 text-gray-700">
            Patient History
          </h2>

          {history.map((h, i) => (
            <div key={i} className="border-b pb-3 mb-3">

              {/* DATE */}
              <p className="text-xs text-gray-500 mb-1">
                {new Date(h.diagnosis.created_at).toLocaleDateString()}
              </p>

              {/* DIAGNOSIS */}
              <p className="font-medium text-gray-800">
                {h.diagnosis.diagnosis_text}
              </p>

              {/* ALLERGIES */}
              {h.diagnosis.allergies && (
                <p className="text-red-500 text-sm">
                  Allergy: {h.diagnosis.allergies}
                </p>
              )}

              {/* MEDICINES */}
              <div className="mt-1 text-sm text-gray-700">
                {h.prescriptions.map((p, j) => (
                  <p key={j}>
                    💊 {p.medicine_name}
                  </p>
                ))}
              </div>

            </div>
          ))}

        </div>      
        
      </div>


      <div className="print-area-v1">
        <div className="a4-page">

          {/* 🔷 HEADER */}
          <div className="header">
            <div className="clinic-left">
              <img src="../../assets/logo.png" className="logo-img" />
              <div>
                <h1>S&O Eyecare & Opticals</h1>
                <p className="tagline">Because we care for your vision</p>
              </div>
            </div>

            <div className="doctor-info">
              <p><b>Dr. Name</b></p>
              <p>MBBS, MD (Ophthalmology)</p>
              <p>Reg No: 12345</p>
            </div>
          </div>

          {/* 🔷 PATIENT INFO */}
          {patient && (
            <div className="patient-box">
              <p><b>Name:</b> {patient.name}</p>
              <p><b>Age:</b> {calculateAge(patient.dob)} yrs</p>
              <p><b>Gender:</b> {patient.gender}</p>
              <p><b>Date:</b> {new Date().toLocaleDateString()}</p>
              <p><b>Phone:</b> {patient.phone}</p>
              <p><b>Patient ID:</b> {patient.patient_code}</p>
            </div>
          )}

          {/* 🔷 DIAGNOSIS */}
          <div className="section">
            <h3>Diagnosis</h3>
            <p>{form.diagnosis_text}</p>
          </div>

          {/* 🔷 ALLERGIES */}
          {form.allergies && (
            <div className="section">
              <h3>Allergies</h3>
              <p className="allergy">{form.allergies}</p>
            </div>
          )}

          {/* 🔷 PRESCRIPTION */}
          <div className="section">
            <h3>Prescription</h3>

            <table className="med-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Medicine</th>
                  <th>Type</th>
                  <th>Dosage</th>
                  <th>Duration</th>
                  <th>Instructions</th>
                </tr>
              </thead>
              <tbody>
                {form.prescriptions.map((p, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{p.medicine_name}</td>
                    <td>{p.type}</td>
                    <td>{p.dosage}</td>
                    <td>{p.duration}</td>
                    <td>{p.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🔷 FOOTER */}
          <div className="footer">
            <p>Doctor Signature</p>
          </div>

        </div>
      </div>
     
    </>
  );

}

export default Diagnosis;