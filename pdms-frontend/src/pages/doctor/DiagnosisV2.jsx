import { useRef } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../services/api";
export default function DiagnosisV2() {

// section toggle
const { id } = useParams();
const navigate = useNavigate(); 
const firstInputRef = useRef(null);
const [spinning, setSpinning] = useState(false);
const [printData, setPrintData] = useState(null);
const [loadingSearch, setLoadingSearch] = useState(false);
const [loadingSave, setLoadingSave] = useState(false);
const [errors, setErrors] = useState({});
const [searchCode, setSearchCode] = useState("");
const [openSection, setOpenSection] = useState("main");
const [history, setHistory] = useState([]);
const [patient, setPatient] = useState(null);
const [appointment, setAppointment] = useState(null);
const [medicines, setMedicines] = useState([]);
const [message, setMessage] = useState(null);
// full form state (future ready)
// useEffect(() => {
//   firstInputRef.current?.focus();
// }, []);
useEffect(() => {
  const fetchMedicines = async () => {
    const res = await api.get("/medicines/");
    setMedicines(res.data);
  };

  fetchMedicines();
}, []);
useEffect(() => {
  if (id) {
    setSearchCode(id);     // fill input box
    handleSearch(id);      // 🔥 AUTO LOAD PATIENT
  }
}, [id]);


const [form, setForm] = useState({
  chief_complaints: [{}],
  systemic_history: [{}],
  history_present_illness: "",
  surgery_history: "",
  allergy_history: "",
  clinical_impression: "",
  advice: "",
  next_visit_date: "",
  next_visit_reason: "",

  refraction: {
    unaided: {},
    pgp: {},
    retinoscopy: {},
    final_refraction: {}
  },

  ocular_exam: {
    slit_lamp: {},
    iop: {},
    lacrimal: {}
  },

  fundus: {},

  prescriptions: [{}]
});


useEffect(() => {
  const handleKey = (e) => {
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      handleSubmit();
    }
  };

  window.addEventListener("keydown", handleKey);
  return () => window.removeEventListener("keydown", handleKey);
}, [form]);
useEffect(() => {
  const firstInput = document.querySelector("[data-first]");
  if (firstInput) firstInput.focus();
}, [patient]);

useEffect(() => {
  const last = form.prescriptions[form.prescriptions.length - 1];

  if (last && last.medicine_id && last.dosage) {
    setForm(prev => ({
      ...prev,
      prescriptions: [...prev.prescriptions, {}]
    }));
  }
}, [form.prescriptions]);
const handleEnterNext = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const formElements = Array.from(
      document.querySelectorAll("input, select, textarea")
    );
    const index = formElements.indexOf(e.target);
    if (index > -1 && index < formElements.length - 1) {
      formElements[index + 1].focus();
    }
  }
};

useEffect(() => {
  if (!message) return;

  const timer = setTimeout(() => {
    setMessage(null);
  }, 3000);

  return () => clearTimeout(timer);
}, [message]);
const toggleSection = (sec) => {
setOpenSection(openSection === sec ? "" : sec);
};

const handleSearch = async (code) => {
  setLoadingSearch(true);


  try {
    // 🔹 PATIENT
    const res = await api.get(`/patients/search/${code}`);
    setPatient(res.data);

    // 🔹 APPOINTMENT (same as V1)
    const apptRes = await api.get("/appointments/todays");

    const found = apptRes.data.find(
      a => a.patient_id === res.data.id && a.status === "pending"
    );

    if (!found) {
      // alert("No pending appointment ❌");
      setMessage({ type: "error", text: "No pending appointment ❌" });
      setAppointment(null);
      return;
    }

    setAppointment(found);
    // 🔥 FETCH HISTORY
    const historyRes = await api.get(`/diagnosis-v2/patient/${res.data.id}`);
    
    setHistory(
      historyRes.data.sort(
        (a, b) =>
          new Date(b.diagnosis.created_at) -
          new Date(a.diagnosis.created_at)
      )
    );


    setTimeout(() => {
      const input = document.querySelector("[data-complaint]");
      input?.focus();
    }, 200);
  } catch (err) {
    console.error(err);
    // alert("Patient not found ❌");
    setMessage({ type: "error", text: "Patient not found ❌" });
  
  } finally {
    setLoadingSearch(false); // 🔥 STOP
  }
};

const handleSave = async () => {
  const cleanComplaints = form.chief_complaints.filter(c => c.complaint);
  const cleanSystemic = form.systemic_history.filter(s => s.disease);
  const cleanPrescriptions = form.prescriptions.filter(
    p => p.medicine_id && p.dosage
  );

  // ❌ VALIDATIONS
  if (!patient || !appointment) {
    // alert("Patient or appointment missing ❌");
    setMessage({ type: "error", text: "Patient or Appointment not found ❌" });
    return;
  }
  const newErrors = {};

  // Chief Complaint
  if (!form.chief_complaints.some(c => c.complaint)) {
    newErrors.complaint = true;
  }

  // Clinical Impression
  if (!form.clinical_impression) {
    newErrors.clinical = true;
  }

  // Prescription
  if (!form.prescriptions.some(p => p.medicine_id && p.dosage)) {
    newErrors.prescription = true;
  }

  setErrors(newErrors);

  // STOP if errors exist
  if (Object.keys(newErrors).length > 0) return;
  setLoadingSave(true);
  try {   
    const payload = {
      patient_id: patient.id,
      appointment_id: appointment.id,

      chief_complaints: cleanComplaints,
      systemic_history: cleanSystemic,

      history_present_illness: form.history_present_illness,
      surgery_history: form.surgery_history,
      allergy_history: form.allergy_history,

      refraction: form.refraction,
      ocular_exam: form.ocular_exam,
      fundus: form.fundus,

      clinical_impression: form.clinical_impression,
      advice: form.advice,

      next_visit_date: form.next_visit_date,
      next_visit_reason: form.next_visit_reason,

      prescriptions: cleanPrescriptions
    };


    const res = await api.post("/diagnosis-v2/", payload);

    // alert("Saved Successfully 🚀");
    setMessage({ type: "success", text: "Saved Successfully 🚀" });
    setPrintData(form);
    handleSearch(patient.patient_code);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setForm({
      chief_complaints: [{}],
      systemic_history: [{}],
      history_present_illness: "",
      surgery_history: "",
      allergy_history: "",
      clinical_impression: "",
      advice: "",
      next_visit_date: "",
      next_visit_reason: "",
      refraction: {
        unaided: {},
        pgp: {},
        retinoscopy: {},
        final_refraction: {}
      },
      ocular_exam: {
        slit_lamp: {},
        iop: {},
        lacrimal: {}
      },
      fundus: {},
      prescriptions: [{}]
    });
  } catch (err) {
    console.error(err);
    // alert("Error saving ❌");
    setMessage({ type: "error", text: "Error saving ❌" });
  }finally {
    setLoadingSave(false);
  }
};

const updateNested = (section, subSection, field, value) => {
  setForm(prev => ({
    ...prev,
    [section]: {
      ...prev[section],
      [subSection]: {
        ...prev[section][subSection],
        [field]: value
      }
    }
  }));
};
const getMedicineName = (id) => {
  const med = medicines.find(m => m.id === id);
  return med ? med.name : "—";
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
const handleRefresh = () => {
  setSpinning(true); // start spin
  setPatient(null);
  setAppointment(null);
  setHistory([]);
  setForm({
    chief_complaints: [{}],
    systemic_history: [{}],
    history_present_illness: "",
    surgery_history: "",
    allergy_history: "",
    clinical_impression: "",
    advice: "",
    next_visit_date: "",
    next_visit_reason: "",
    refraction: {
      unaided: {},
      pgp: {},
      retinoscopy: {},
      final_refraction: {}
    },
    ocular_exam: {
      slit_lamp: {},
      iop: {},
      lacrimal: {}
    },
    fundus: {},
    prescriptions: [{}]
    

  });
  setTimeout(() => {
      setSpinning(false); // stop after 1 sec
    }, 1000);
};
  return ( 

    <>
      {/* <div className="flex gap-4 p-4 bg-gradient-to-br from-blue-100 to-blue-200 min-h-screen"> */}
      <div className="flex gap-2 w-full bg-gradient-to-br from-blue-100 to-blue-200 min-h-screen overflow-x-hidden">

        {/* LEFT MAIN */}
        {/* <div className="w-[75%] space-y-4 no-print"> */}
        <div className="flex-[3] space-y-4 no-print p-4">
        


        {/* <div className="p-4 space-y-4 no-print"> */}
          {message && (
          
            <div
              className={`p-3 rounded text-white ${
                message.type === "error" ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {message.text}
              <button onClick={() => setMessage(null)}>✖</button>

            </div>
              
            

            
          )}
          {/* <div className="border p-3 rounded flex gap-2 items-center">
            <input
              placeholder="Enter Patient ID"
              ref={firstInputRef}
              className="border p-2"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch(e.target.value);
              }}
            />

            <button
              onClick={() => handleSearch(searchCode)}
              className="bg-blue-500 text-white px-3 py-1"
              disabled={loadingSearch}
            >
              {loadingSearch ? "Searching..." : "Search"}
            </button> */}


            {/* <button
              onClick={() => window.location.reload()}
              className="bg-gray-500 text-white px-3 py-1 rounded"
            >
              🔄 Refresh
            </button> */}
            {/* <button
              onClick={handleRefresh}
              className="bg-gray-500 text-white px-3 py-1 rounded"
            >
              🔄 Refresh
            </button>


          </div> */}
          <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow">

            <button
            onClick={() => navigate("/doctor")} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Back
            </button>

            <input
              placeholder="Patient ID"
              ref={firstInputRef}
              className="flex-1 border rounded-lg p-2"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch(e.target.value);
              }}
            />
            <button
              onClick={() => handleSearch(searchCode)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              disabled={loadingSearch}
            >
              {loadingSearch ? "Searching..." : "Search"}
            </button>
            
            <button
              onClick={handleRefresh}
              className="bg-gray-500 text-white px-3 py-2 rounded-lg flex items-center justify-center"
            >
              <svg className={`w-5 h-5 ${spinning ? "animate-spin" : ""}`} 
                  
                   
                   xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                
                <path d="M21 12a9 9 0 0 0-15.35-6.36L3 8" />
                <path d="M3 3v5h5" />
                
                
                <path d="M3 12a9 9 0 0 0 15.35 6.36L21 16" />
                <path d="M21 21v-5h-5" />
              </svg>
              
            </button>

          </div>
          
                    

          {patient && (
            // <div className="bg-blue-100 p-4 rounded-xl shadow text-sm text-gray-700 grid grid-cols-2 gap-2">

            //   <p><b>Name:</b> {patient.name}</p>
            //   <p><b>Patient Code:</b> {patient.patient_code}</p>

            //   <p><b>Age:</b> {calculateAge(patient.dob)} yrs</p>
            //   <p><b>Gender:</b> {patient.gender}</p>

            //   <p><b>Blood Group:</b> {patient.blood_group}</p>
            //   <p><b>Marital Status:</b> {patient.marital_status}</p>

            //   <p><b>Contact:</b> {patient.phone}</p>
            //   <p><b>Emergency:</b> {patient.emergency_contact}</p>

            //   <p className="col-span-2">
            //     <b>Address:</b> {patient.address}
            //   </p>

            // </div>
            <div className="bg-white p-4 rounded-xl shadow flex gap-4">

              {/* IMAGE */}
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>

              {/* DETAILS */}
              <div className="flex-1">

                <div className="bg-blue-100 inline-block px-3 py-1 rounded-lg font-semibold mb-2">
                  Patient ID : {patient.patient_code}
                </div>

                <div className="grid grid-cols-2 text-sm text-gray-800 gap-1">
                  <p>NAME - {patient.name}</p>
                  <p>AGE - {calculateAge(patient.dob)}</p>
                  <p>BLOOD GROUP - {patient.blood_group}</p>
                  <p>CONTACT - {patient.phone}</p>
                  <p>ADDRESS - {patient.address}</p>
                  <p>GENDER - {patient.gender}</p>
                  <p>MARITAL STATUS - {patient.marital_status}</p>
                  <p>EMERGENCY CONTACT - {patient.emergency_contact}</p>
                  
                </div>

              </div>
            </div>

          )}
          {patient && appointment && (
            <div className="bg-yellow-100 border border-yellow-300 p-3 rounded-lg text-sm">
              <p><b>Appointment Time:</b> {appointment.time}</p>
              <p><b>Status:</b> {appointment.status}</p>
              <p><b>Notes:</b> {appointment.notes || "—"}</p>
            </div>
          )}
          {patient && !appointment && (
            <div className="bg-red-100 border border-red-300 p-3 rounded-lg text-sm text-red-700">
              No active appointment found for today ❌
            </div>
          )}

          <div className="bg-white rounded-xl shadow">

            <div
              onClick={() => toggleSection("main")}
              className="flex justify-between items-center p-4 font-semibold text-blue-900 cursor-pointer"
            >
              MAIN FORM
              <span>{openSection === "main" ? "▲" : "▼"}</span>
            </div>

            {openSection === "main" && (
              <div className="p-4 border-t">


                {/* 🔹 CHIEF COMPLAINT */}
                <div className="mb-4">
                  <p className="font-semibold mb-2">Chief Complaint</p>

                  {form.chief_complaints.map((c, i) => (
                    <div key={i} className="grid grid-cols-5 gap-2 mb-2">

                      {/* <input
                        placeholder="Complaint"
                        data-complaint
                        value={c.complaint || ""}
                        // className={`border p-2 ${errors.complaint ? "border-red-500" : ""}`}
                        className={`border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.complaint ? "border-red-500" : ""}`}
                        onChange={(e) => {
                          const updated = [...form.chief_complaints];
                          updated[i].complaint = e.target.value;
                          setForm({ ...form, chief_complaints: updated });
                        }}
                      /> */}
                      <select
                        value={c.complaint || ""}
                        data-first
                        className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e) => {
                          const updated = [...form.chief_complaints];
                          updated[i].complaint = e.target.value;
                          setForm({ ...form, chief_complaints: updated });
                        }}
                        onKeyDown={handleEnterNext}
                      >
                        <option value="">Select Complaint</option>
                        <option value="Blurred Vision">Blurred Vision</option>
                        <option value="Eye Pain">Eye Pain</option>
                        <option value="Redness">Redness</option>
                        <option value="Watering">Watering</option>
                      </select>
                      {/* <input
                        placeholder="Eye"
                        className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={c.eye || ""}
                        onChange={(e) => {
                          const updated = [...form.chief_complaints];
                          updated[i].eye = e.target.value;
                          setForm({ ...form, chief_complaints: updated });
                        }}
                      /> */}
                      <select
                        value={c.eye || ""}
                        className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e) => {
                          const updated = [...form.chief_complaints];
                          updated[i].eye = e.target.value;
                          setForm({ ...form, chief_complaints: updated });
                        }}
                        onKeyDown={handleEnterNext}
                      >
                        <option value="">Select Eye</option>
                        <option value="RE">Right Eye (OD)</option>
                        <option value="LE">Left Eye (OS)</option>
                        <option value="BE">Both Eyes (OU)</option>
                      </select>


                      {/* <input
                        placeholder="Duration"
                        value={c.duration || ""}
                        className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e) => {
                          const updated = [...form.chief_complaints];
                          updated[i].duration = e.target.value;
                          setForm({ ...form, chief_complaints: updated });
                        }}
                      /> */}
                      <select
                        value={c.duration || ""}
                        className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e) => {
                          const updated = [...form.chief_complaints];
                          updated[i].duration = e.target.value;
                          setForm({ ...form, chief_complaints: updated });
                        }}
                        onKeyDown={handleEnterNext}
                      >
                        <option value="">Select Duration</option>
                        <option value="1 Day">1 Day</option>
                        <option value="1 Week">1 Week</option>
                        <option value="1 Month">1 Month</option>
                        <option value="Chronic">Chronic</option>
                      </select>
                      <input
                        placeholder="Comment"
                        value={c.comment || ""}
                        className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e) => {
                          const updated = [...form.chief_complaints];
                          updated[i].comment = e.target.value;
                          setForm({ ...form, chief_complaints: updated });
                        }}
                        onKeyDown={handleEnterNext}
                      />
                      <button
                        onClick={() => {
                          const updated = form.chief_complaints.filter((_, idx) => idx !== i);
                          setForm({ ...form, chief_complaints: updated });
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow"
                      >
                        X
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const updated = [...form.chief_complaints, {}];
                      setForm({ ...form, chief_complaints: updated });

                      setTimeout(() => {
                        const inputs = document.querySelectorAll("[data-complaint]");
                        inputs[inputs.length - 1]?.focus();
                      }, 100);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow"
                  >
                    + Add Complaint
                  </button>


                </div>

                {/* 🔹 HISTORY */}
                <div className="mb-4">
                  <p className="font-semibold mb-2">History of Present Illness</p>

                  <textarea
                    placeholder="Write..."
                    className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-sm resize-none"
                    value={form.history_present_illness || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        history_present_illness: e.target.value
                      })
                    }
                    onKeyDown={handleEnterNext}
                  />
                </div>

                {/* 🔹 SYSTEMIC HISTORY */}
                <div className="mb-4">
                  <p className="font-semibold mb-2">Systemic History</p>

                  {form.systemic_history.map((s, i) => (
                    <div key={i} className="grid grid-cols-3 gap-2 mb-2">

                      {/* <input
                        placeholder="Disease"
                        data-systemic
                        className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={s.disease || ""}
                        onChange={(e) => {
                          const updated = [...form.systemic_history];
                          updated[i].disease = e.target.value;
                          setForm({ ...form, systemic_history: updated });
                        }}
                      /> */}
                      <select
                        value={s.disease || ""}
                        className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e) => {
                          const updated = [...form.systemic_history];
                          updated[i].disease = e.target.value;
                          setForm({ ...form, systemic_history: updated });
                        }}
                        onKeyDown={handleEnterNext}
                      >
                        <option value="">Select Disease</option>
                        <option value="Diabetes">Diabetes</option>
                        <option value="Hypertension">Hypertension</option>
                        <option value="Asthma">Asthma</option>
                        <option value="Thyroid">Thyroid</option>
                      </select>
                      {/* <input
                        placeholder="Duration"
                        className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={s.duration || ""}
                        onChange={(e) => {
                          const updated = [...form.systemic_history];
                          updated[i].duration = e.target.value;
                          setForm({ ...form, systemic_history: updated });
                        }}
                      /> */}
                      <select
                        value={s.duration || ""}
                        className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e) => {
                          const updated = [...form.systemic_history];
                          updated[i].duration = e.target.value;
                          setForm({ ...form, systemic_history: updated });
                        }}
                        onKeyDown={handleEnterNext}
                      >
                        <option value="">Select Duration</option>
                        <option value="1 Year">1 Year</option>
                        <option value="5 Years">5 Years</option>
                        <option value="10+ Years">10+ Years</option>
                      </select>
                      <input
                        placeholder="Comment"
                        className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={s.comment || ""}
                        onChange={(e) => {
                          const updated = [...form.systemic_history];
                          updated[i].comment = e.target.value;
                          setForm({ ...form, systemic_history: updated });
                        }}
                        onKeyDown={handleEnterNext}
                      />

                    </div>
                  ))}

                  <button
                  
                    onClick={() => {
                      const updated = [...form.systemic_history, {}];
                      setForm({ ...form, systemic_history: updated });

                      setTimeout(() => {
                        const inputs = document.querySelectorAll("[data-systemic]");
                        inputs[inputs.length - 1]?.focus();
                      }, 100);
                    }}

                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow"
                  >
                    + Add Systemic
                  </button>
                </div>

                {/* 🔹 SURGERY */}
                <div className="mb-4">
                  <p className="font-semibold mb-2">Surgeries / Laser History</p>

                  <textarea
                    placeholder="Write..."
                    className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-sm resize-none"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        surgery_history: e.target.value
                      })
                    }
                    onKeyDown={handleEnterNext}
                  />
                </div>

                {/* 🔹 ALLERGY */}
                <div className="mb-4">
                  <p className="font-semibold mb-2">Allergy History</p>

                  <textarea
                    placeholder="Write..."
                    className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-sm resize-none"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        allergy_history: e.target.value
                      })
                    }
                    onKeyDown={handleEnterNext}
                  />
                </div>

              </div>
            )}
          </div>

          {/* <div className="border p-3 rounded">
            <div
              onClick={() => toggleSection("refraction")}
              className="font-bold cursor-pointer"
            >
              REFRACTION SECTION ⬇
            </div>

            {openSection === "refraction" && ( <div className="mt-3 space-y-4"> */}
          <div className="bg-white rounded-xl shadow">

            <div
              onClick={() => toggleSection("refraction")}
              className="flex justify-between items-center p-4 font-semibold text-blue-900 cursor-pointer"
            >
              REFRACTION SECTION 
              <span>{openSection === "refraction" ? "▲" : "▼"}</span>
            </div>

            {openSection === "refraction" && (
              <div className="p-4 border-t">
            
              {/* 🔹 UNAIDED */}
              <div>
                <p className="font-semibold">UNAIDED</p>

                <div className="grid grid-cols-3 gap-2">

                  
                  {/* <input
                    placeholder="Right Eye Distance"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.unaided.re_distance || ""}
                    onKeyDown={handleEnterNext}
                    onChange={(e) =>
                      updateNested("refraction", "unaided", "re_distance", e.target.value)
                    }
                  /> */}

                  <select
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.unaided.re_distance || ""}
                    onChange={(e) =>
                      updateNested("refraction", "unaided", "re_distance", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  >
                    <option value="">Right Eye Distance</option>
                    <option value="FFL">FFL</option>
                    <option value="6/6">6/6</option>
                    <option value="6/6P">6/6P</option>
                    <option value="6/9">6/9</option>
                    <option value="6/9P">6/9P</option>
                    <option value="6/12">6/12</option>
                    <option value="6/12P">6/12P</option>
                    <option value="6/18">6/18</option>
                    <option value="6/18P">6/18P</option>
                    <option value="6/24">6/24</option>
                    <option value="6/24P">6/24P</option>
                    <option value="6/36">6/36</option>
                    <option value="6/36P">6/36P</option>
                    <option value="6/60">6/60</option>
                    <option value="CF5M">CF5M</option>
                    <option value="CF4M">CF4M</option>
                    <option value="CF3M">CF3M</option>
                    <option value="CF2M">CF2M</option>
                    <option value="CF1M">CF1M</option>
                    <option value="CF1/2M">CF1/2M</option>
                    <option value="CFCF">CFCF</option>
                    <option value="HM">HM+</option>
                    <option value="PL+">PL+</option>
                    <option value="PL-">PL-</option>
                    <option value="NLP">NLP</option>
                  </select>

                  <input
                    placeholder="Pinhole OD"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.unaided.re_pinhole || ""}
                    onChange={(e) =>
                      updateNested("refraction", "unaided", "re_pinhole", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  />

                  {/* <input
                    placeholder="Right Eye Near"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.unaided.re_near || ""}
                    onChange={(e) =>
                      updateNested("refraction", "unaided", "re_near", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  /> */}
                  <select
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.unaided.re_near || ""}
                    onChange={(e) =>
                      updateNested("refraction", "unaided", "re_near", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  >
                    <option value="">Right Eye Near</option>
                    <option value="6/60">6/60</option>
                    <option value="6/24">6/24</option>
                    <option value="6/18">6/18</option>
                    <option value="6/12">6/12</option>
                    <option value="6/9">6/9</option>
                    <option value="6/6">6/6</option>
                    
                    <option value="N5">N5</option>
                    <option value="N6">N6</option>
                    <option value="N8">N8</option>
                    <option value="N10">N10</option>
                    <option value="N12">N12</option>
                    <option value="N18">N18</option>
                    <option value="N24">N24</option>
                    <option value="N36">N36</option>
                  </select>
                  
                  {/* 
                  <input
                    placeholder="Left Eye Distance"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.unaided.le_distance || ""}
                    onChange={(e) =>
                      updateNested("refraction", "unaided", "le_distance", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  /> */}

                  <select
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.unaided.le_distance || ""}
                    onChange={(e) =>
                      updateNested("refraction", "unaided", "le_distance", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  >
                    <option value="">Left Eye Distance</option>
                    <option value="FFL">FFL</option>
                    <option value="6/6">6/6</option>
                    <option value="6/6P">6/6P</option>
                    <option value="6/9">6/9</option>
                    <option value="6/9P">6/9P</option>
                    <option value="6/12">6/12</option>
                    <option value="6/12P">6/12P</option>
                    <option value="6/18">6/18</option>
                    <option value="6/18P">6/18P</option>
                    <option value="6/24">6/24</option>
                    <option value="6/24P">6/24P</option>
                    <option value="6/36">6/36</option>
                    <option value="6/36P">6/36P</option>
                    <option value="6/60">6/60</option>
                    <option value="CF5M">CF5M</option>
                    <option value="CF4M">CF4M</option>
                    <option value="CF3M">CF3M</option>
                    <option value="CF2M">CF2M</option>
                    <option value="CF1M">CF1M</option>
                    <option value="CF1/2M">CF1/2M</option>
                    <option value="CFCF">CFCF</option>
                    <option value="HM">HM+</option>
                    <option value="PL+">PL+</option>
                    <option value="PL-">PL-</option>
                    <option value="NLP">NLP</option>
                  </select>


                  <input
                    placeholder="Pinhole OS"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.unaided.le_pinhole || ""}
                    onChange={(e) =>
                      updateNested("refraction", "unaided", "le_pinhole", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  />

                  {/* <input
                    placeholder="Left Eye Near"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.unaided.le_near || ""}
                    onChange={(e) =>
                      updateNested("refraction", "unaided", "le_near", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  /> */}


                  <select
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.unaided.le_near || ""}
                    onChange={(e) =>
                      updateNested("refraction", "unaided", "le_near", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  >
                    <option value="">Left Eye Near</option>
                    <option value="6/60">6/60</option>
                    <option value="6/24">6/24</option>
                    <option value="6/18">6/18</option>
                    <option value="6/12">6/12</option>
                    <option value="6/9">6/9</option>
                    <option value="6/6">6/6</option>
                    
                    <option value="N5">N5</option>
                    <option value="N6">N6</option>
                    <option value="N8">N8</option>
                    <option value="N10">N10</option>
                    <option value="N12">N12</option>
                    <option value="N18">N18</option>
                    <option value="N24">N24</option>
                    <option value="N36">N36</option>
                  </select>

                  <input
                    placeholder="Comment"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 col-span-2"
                    value={form.refraction.unaided.comment || ""}
                    onChange={(e) =>
                      updateNested("refraction", "unaided", "comment", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  />

                  
                </div>
              </div>

              {/* 🔹 PGP */}
              <div className="mb-2">
                <p className="font-semibold">PGP</p>

                <div className="grid grid-cols-6 gap-2">
                  <input
                    placeholder="OD SPH"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.pgp.re_sph || ""}
                    onChange={(e) =>
                      updateNested("refraction", "pgp", "re_sph", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  />

                  <input
                    placeholder="OD CYL"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.pgp.re_cyl || ""}
                    onChange={(e) =>
                      updateNested("refraction", "pgp", "re_cyl", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  />

                  <input
                    placeholder="OD AXIS"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.pgp.re_axis || ""}
                    onChange={(e) =>
                      updateNested("refraction", "pgp", "re_axis", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  />
                  
                  {/* <input
                    placeholder="OD ADD"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.pgp.re_add || ""}
                    onChange={(e) =>
                      updateNested("refraction", "pgp", "re_add", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  /> */}
                  <input
                    placeholder="OD VISION"
                    value={form.refraction.pgp.re_vision_before || ""}
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onKeyDown={handleEnterNext}
                    onChange={(e) =>
                      updateNested(
                        "refraction",
                        "pgp",
                        "re_vision_before",
                        e.target.value
                      )
                    }
                  />

                  <input
                    placeholder="OD ADD"
                    value={form.refraction.pgp.re_add || ""}
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onKeyDown={handleEnterNext}
                    onChange={(e) =>
                      updateNested(
                        "refraction",
                        "pgp",
                        "re_add",
                        e.target.value
                      )
                    }
                  />

                  <input
                    placeholder="OD VISION"
                    value={form.refraction.pgp.re_vision_after || ""}
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onKeyDown={handleEnterNext}
                    onChange={(e) =>
                      updateNested(
                        "refraction",
                        "pgp",
                        "re_vision_after",
                        e.target.value
                      )
                    }
                  />
                  {/* <input
                    placeholder="Lens Type"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.pgp.lens_type || ""}
                    onChange={(e) =>
                      updateNested("refraction", "pgp", "lens_type", e.target.value)
                    }
                  /> */}
                  

                  <input
                    placeholder="OS SPH"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.pgp.le_sph || ""}
                    onChange={(e) =>
                      updateNested("refraction", "pgp", "le_sph", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  />
                  <input
                    placeholder="OS CYL"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.pgp.le_cyl || ""}
                    onChange={(e) =>
                      updateNested("refraction", "pgp", "le_cyl", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  />
                  <input
                    placeholder="OS AXIS"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.pgp.le_axis || ""}
                    onChange={(e) =>
                      updateNested("refraction", "pgp", "le_axis", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  />
                  
                  {/* <input
                    placeholder="OS ADD"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.pgp.le_add || ""}
                    onChange={(e) =>
                      updateNested("refraction", "pgp", "le_add", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  /> */}
                  <input
                    placeholder="OS VISION"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.pgp.le_vision_before || ""}
                    onChange={(e) =>
                      updateNested(
                        "refraction",
                        "pgp",
                        "le_vision_before",
                        e.target.value
                      )
                    }
                    onKeyDown={handleEnterNext}
                  />

                  <input
                    placeholder="OS ADD"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.pgp.le_add || ""}
                    onChange={(e) =>
                      updateNested(
                        "refraction",
                        "pgp",
                        "le_add",
                        e.target.value
                      )
                    }
                    onKeyDown={handleEnterNext}
                  />

                  <input
                    placeholder="OS VISION"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.pgp.le_vision_after || ""}
                    onChange={(e) =>
                      updateNested(
                        "refraction",
                        "pgp",
                        "le_vision_after",
                        e.target.value
                      )
                    }
                    onKeyDown={handleEnterNext}
                  />
                  

                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <select
                    value={form.refraction.pgp.lens_type || ""}
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={(e) =>
                      updateNested("refraction", "pgp", "lens_type", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  >
                    <option value="">Select Lens</option>
                    <option value="Single Vision">Single Vision</option>
                    <option value="Bifocal">Bifocal</option>
                    <option value="Progressive">Progressive</option>
                  </select>
                  <input
                    placeholder="Comment"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.pgp.comment || ""}
                    onChange={(e) =>
                      updateNested("refraction", "pgp", "comment", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  />
                </div>
              </div>
              <div>


                <p className="font-semibold mb-2 ">Colour Vision</p>

                {/* <div className="grid grid-cols-2 gap-2 mb-4">

                  <select
                    value={form.ocular_exam.color_vision?.re || ""}
                    onChange={(e) =>
                      updateNested("ocular_exam", "color_vision", "re", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                    className="border rounded-lg p-2"
                  >
                    <option value="">Right Eye</option>
                    <option value="Normal">Normal</option>
                    <option value="Defective">Defective</option>
                  </select>

                  <select
                    value={form.ocular_exam.color_vision?.le || ""}
                    onChange={(e) =>
                      updateNested("ocular_exam", "color_vision", "le", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                    className="border rounded-lg p-2"
                  >
                    <option value="">Left Eye</option>
                    <option value="Normal">Normal</option>
                    <option value="Defective">Defective</option>
                  </select>

                </div> */}
<div className="grid grid-cols-2 gap-2 mb-4">

  {/* Right Eye */}
  <select
    value={form.ocular_exam.color_vision?.re || ""}
    onChange={(e) =>
      updateNested("ocular_exam", "color_vision", "re", e.target.value)
    }
    onKeyDown={handleEnterNext}
    className="border rounded-lg p-2"
  >
    <option value="">Right Eye</option>
    <option value="Normal">Normal</option>
    <option value="Defective">Defective</option>
  </select>

  {/* Left Eye */}
  <select
    value={form.ocular_exam.color_vision?.le || ""}
    onChange={(e) =>
      updateNested("ocular_exam", "color_vision", "le", e.target.value)
    }
    onKeyDown={handleEnterNext}
    className="border rounded-lg p-2"
  >
    <option value="">Left Eye</option>
    <option value="Normal">Normal</option>
    <option value="Defective">Defective</option>
  </select>

  {/* Right Eye Comment */}
  <input
    type="text"
    placeholder="Right Eye Comment"
    className="border rounded-lg p-2"
    value={form.ocular_exam.color_vision?.re_comment || ""}
    onChange={(e) =>
      updateNested(
        "ocular_exam",
        "color_vision",
        "re_comment",
        e.target.value
      )
    }
    onKeyDown={handleEnterNext}
  />

  {/* Left Eye Comment */}
  <input
    type="text"
    placeholder="Left Eye Comment"
    className="border rounded-lg p-2"
    value={form.ocular_exam.color_vision?.le_comment || ""}
    onChange={(e) =>
      updateNested(
        "ocular_exam",
        "color_vision",
        "le_comment",
        e.target.value
      )
    }
    onKeyDown={handleEnterNext}
  />

</div>
              </div>

              <div >
                {/* <p className="font-semibold">RETINOSCOPY</p> */}
                <div className="flex items-center gap-4 mb-2">
                  <p className="font-semibold">RETINOSCOPY</p>

                  <select
                    value={form.refraction.retinoscopy.type || ""}
                    className="border rounded-lg p-1 text-sm w-40"
                    onChange={(e) =>
                      updateNested("refraction", "retinoscopy", "type", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  >
                    <option value="">Select</option>
                    <option value="Dry">Dry</option>
                    <option value="Wet">Wet</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 gap-2">                
                  <input
                    placeholder="OD SPH"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.retinoscopy.re_sph || ""}
                    onChange={(e) =>
                      updateNested("refraction", "retinoscopy", "re_sph", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  />
                  <input
                    placeholder="OD CYL"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.retinoscopy.re_cyl || ""}
                    onChange={(e) =>
                      updateNested("refraction", "retinoscopy", "re_cyl", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  />
                  <input
                    placeholder="OD AXIS"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.retinoscopy.re_axis || ""}
                    onChange={(e) =>
                      updateNested("refraction", "retinoscopy", "re_axis", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  />
                  <input
                    placeholder="OD GLOW"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.retinoscopy.re_glow || ""}
                    onChange={(e) =>
                      updateNested("refraction", "retinoscopy", "re_glow", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  />
                  <input
                    placeholder="OS SPH"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.retinoscopy.le_sph || ""}
                    onChange={(e) =>
                      updateNested("refraction", "retinoscopy", "le_sph", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  />
                  <input
                    placeholder="OS CYL"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.retinoscopy.le_cyl || ""}
                    onChange={(e) =>
                      updateNested("refraction", "retinoscopy", "le_cyl", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  />
                  <input
                    placeholder="OS AXIS"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.retinoscopy.le_axis || ""}
                    onChange={(e) =>
                      updateNested("refraction", "retinoscopy", "le_axis", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  />
                  <input
                    placeholder="OS GLOW"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.refraction.retinoscopy.le_glow || ""}
                    onChange={(e) =>
                      updateNested("refraction", "retinoscopy", "le_glow", e.target.value)
                    }
                    onKeyDown={handleEnterNext}
                  />
                </div>
              </div>
              <div>
                <p className="font-semibold">FINAL REFRACTION</p>

                <div className="grid grid-cols-5 gap-2">
                <input
                  placeholder="OD SPH"
                  className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.refraction.final_refraction.re_sph || ""}
                  onChange={(e) =>
                    updateNested("refraction", "final_refraction", "re_sph", e.target.value)
                  }
                  onKeyDown={handleEnterNext}
                />

                <input
                  placeholder="OD CYL"
                  className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.refraction.final_refraction.re_cyl || ""}
                  onChange={(e) =>
                    updateNested("refraction", "final_refraction", "re_cyl", e.target.value)
                  }
                  onKeyDown={handleEnterNext}
                />
                <input
                  placeholder="OD AXIS"
                  className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.refraction.final_refraction.re_axis || ""}
                  onChange={(e) =>
                    updateNested("refraction", "final_refraction", "re_axis", e.target.value)
                  }
                  onKeyDown={handleEnterNext}
                />

                <input
                  placeholder="OD BCVA"
                  className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.refraction.final_refraction.re_bcva || ""}
                  onChange={(e) =>
                    updateNested("refraction", "final_refraction", "re_bcva", e.target.value)
                  }
                  onKeyDown={handleEnterNext}
                />
                {/* <input
                  placeholder="OD CHART"
                  className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.refraction.final_refraction.re_chart || ""}
                  onChange={(e) =>
                    updateNested("refraction", "final_refraction", "re_chart", e.target.value)
                  }
                  onKeyDown={handleEnterNext}
                /> */}

                {/* <input
                  placeholder="CHART"
                  className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 row-span-2"
                  value={form.refraction.final_refraction.chart || ""}
                  onChange={(e) =>
                    updateNested(
                      "refraction",
                      "final_refraction",
                      "chart",
                      e.target.value
                    )
                  }
                  onKeyDown={handleEnterNext}
                /> */}
                <select
                  value={form.refraction.final_refraction.chart || ""}
                  className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 row-span-2 "
                  onChange={(e) =>
                    updateNested(
                      "refraction",
                      "final_refraction",
                      "chart",
                      e.target.value
                    )
                  }
                  onKeyDown={handleEnterNext}
                >
                  <option value="">Select Chart</option>
                  <option value="Hindi Chart">Hindi Chart</option>
                  <option value="E Chart">E Chart</option>
                  <option value="C Chart">C Chart</option>
                  <option value="English Chart, Number Chart">English Chart, Number Chart</option>
                  <option value="Picture">Picture Chart</option>
              
                </select>
                <input
                  placeholder="OS SPH"
                  className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.refraction.final_refraction.le_sph || ""}
                  onChange={(e) =>
                    updateNested("refraction", "final_refraction", "le_sph", e.target.value)
                  }
                  onKeyDown={handleEnterNext}
                />

                <input
                  placeholder="OS CYL"
                  className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.refraction.final_refraction.le_cyl || ""}
                  onChange={(e) =>
                    updateNested("refraction", "final_refraction", "le_cyl", e.target.value)
                  }
                  onKeyDown={handleEnterNext}
                />
                <input
                  placeholder="OS AXIS"
                  className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.refraction.final_refraction.le_axis || ""}
                  onChange={(e) =>
                    updateNested("refraction", "final_refraction", "le_axis", e.target.value)
                  }
                  onKeyDown={handleEnterNext}
                />

                <input
                  placeholder="OS BCVA"
                  className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.refraction.final_refraction.le_bcva || ""}
                  onChange={(e) =>
                    updateNested("refraction", "final_refraction", "le_bcva", e.target.value)
                  }
                  onKeyDown={handleEnterNext}
                />
                
                {/* <input
                  placeholder="OS CHART"
                  className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.refraction.final_refraction.le_chart || ""}
                  onChange={(e) =>
                    updateNested("refraction", "final_refraction", "le_chart", e.target.value)
                  }
                  onKeyDown={handleEnterNext}
                /> */}


                <input
                  placeholder="OD ADD"
                  className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.refraction.final_refraction.re_add || ""}
                  onChange={(e) =>
                    updateNested(
                      "refraction",
                      "final_refraction",
                      "re_add",
                      e.target.value
                    )
                  }
                  onKeyDown={handleEnterNext}
                />

                <input
                  placeholder="At (cm)"
                  className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 row-span-2 "
                  value={form.refraction.final_refraction.at || ""}
                  onChange={(e) =>
                    updateNested(
                      "refraction",
                      "final_refraction",
                      "at",
                      e.target.value
                    )
                  }
                  onKeyDown={handleEnterNext}
                />

                <input
                  placeholder="OD BCVA"
                  className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.refraction.final_refraction.re_near_bcva || ""}
                  onChange={(e) =>
                    updateNested(
                      "refraction",
                      "final_refraction",
                      "re_near_bcva",
                      e.target.value
                    )
                  }
                  onKeyDown={handleEnterNext}
                />
                <select
                  value={form.refraction.final_refraction.chart_type || ""}
                  className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 row-span-2 "
                  onChange={(e) =>
                    updateNested("refraction", "final_refraction", "chart_type", e.target.value)
                  }
                  onKeyDown={handleEnterNext}
                >
                  <option value="">Select Chart</option>
                  <option value="Snellen">Hindi Chart</option>
                  <option value="LogMAR">E Chart</option>
                  <option value="LogMAR">C Chart</option>
                  <option value="LogMAR">English Chart, Number Chart</option>
                  <option value="LogMAR">Picture Chart</option>
              
                </select>
                <div></div>
                <input
                  placeholder="OS ADD"
                  className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.refraction.final_refraction.le_add || ""}
                  onChange={(e) =>
                    updateNested(
                      "refraction",
                      "final_refraction",
                      "le_add",
                      e.target.value
                    )
                  }
                  onKeyDown={handleEnterNext}
                />

                

                <input
                  placeholder="OS BCVA"
                  className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.refraction.final_refraction.le_near_bcva || ""}
                  onChange={(e) =>
                    updateNested(
                      "refraction",
                      "final_refraction",
                      "le_near_bcva",
                      e.target.value
                    )
                  }
                  onKeyDown={handleEnterNext}
                />
                {/* <input
                  placeholder="ADD"
                  className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.refraction.final_refraction.add || ""}
                  onChange={(e) =>
                    updateNested("refraction", "final_refraction", "add", e.target.value)
                  }
                  onKeyDown={handleEnterNext}
                /> */}

                {/* <input
                  placeholder="At (cm)"
                  className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.refraction.final_refraction.at || ""}
                  onChange={(e) =>
                    updateNested("refraction", "final_refraction", "at", e.target.value)
                  }
                  onKeyDown={handleEnterNext}
                /> */}
                {/* <input
                  placeholder="Chart Type"
                  className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 col-span-2"
                  value={form.refraction.final_refraction.chart_type || ""}
                  onChange={(e) =>
                    updateNested("refraction", "final_refraction", "chart_type", e.target.value)
                  }
                /> */}
               
                <input
                  placeholder="Comment"
                  className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 col-span-5"
                  value={form.refraction.final_refraction.comment || ""}
                  onChange={(e) =>
                    updateNested("refraction", "final_refraction", "comment", e.target.value)
                  }
                  onKeyDown={handleEnterNext}
                />
                

                </div>
              </div>

            </div>
            
            )}
          
          </div>
          {/* <div className="border p-3 rounded">
            <div
              onClick={() => toggleSection("ocular")}
              className="font-bold cursor-pointer"
            >
              OCULAR EXAMINATION ⬇
            </div>

            {openSection === "ocular" && (
              <div className="mt-3 space-y-4"> */}

          <div className="bg-white rounded-xl shadow">

            <div
              onClick={() => toggleSection("ocular")}
              className="flex justify-between items-center p-4 font-semibold text-blue-900 cursor-pointer"
            >
              OCULAR EXAMINATION
              <span>{openSection === "ocular" ? "▲" : "▼"}</span>
            </div>

            {openSection === "ocular" && (
              <div className="p-4 border-t">
                

                {/* 🔹 OCULAR MOTILITY */}
                <div>
                  <p className="font-semibold">Ocular Motility</p>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Right Eye"
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.motility?.re || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "motility", "re", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    />
                    <input
                      placeholder="Left Eye"
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.motility?.le || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "motility", "le", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    />
                  </div>
                </div>

                {/* 🔥 SLIT LAMP */}
                <div>
                  <p className="font-semibold">Slit Lamp Examination</p>

                  <div className="grid grid-cols-3 gap-2">
                    <div></div>
                    <p className="text-center font-bold">OD</p>
                    <p className="text-center font-bold">OS</p>
                    <p className="text-center font-semibold">Lid</p>


                    {/* <input
                      placeholder="Lid Right"
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.slit_lamp?.eyeball_re || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "eyeball_re", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    /> */}
                    <select
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.slit_lamp?.eyeball_re || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "eyeball_re", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    >
                      
                      <option value="Flat">Flat</option>
                      <option value="Blepharitis">Blepharitis</option>
                      <option value="Stye">Stye</option>
                      <option value="Chalazion">Chalazion</option>
                      <option value="Ptosis">Ptosis</option>
                      <option value="Entropion">Entropion</option>
                      <option value="Ectropion">Ectropion</option>
                      <option value="Lagophthalmos">Lagophthalmos</option>
                    </select>

                    {/* <input
                      placeholder="Lid Left"
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.slit_lamp?.eyeball_le || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "eyeball_le", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    /> */}

                    <select
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.slit_lamp?.eyeball_le || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "eyeball_le", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    >
                      
                      <option value="Flat">Flat</option>
                      <option value="Blepharitis">Blepharitis</option>
                      <option value="Stye">Stye</option>
                      <option value="Chalazion">Chalazion</option>
                      <option value="Ptosis">Ptosis</option>
                      <option value="Entropion">Entropion</option>
                      <option value="Ectropion">Ectropion</option>
                      <option value="Lagophthalmos">Lagophthalmos</option>
                    </select>
                    <p className="text-center font-semibold">Conjunctiva</p>

                    {/* <input
                      placeholder="Conjunctiva Right"
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.slit_lamp?.conj_re || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "conj_re", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    /> */}

                    <select
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.slit_lamp?.conj_re || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "conj_re", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    >
                      <option value="Normal">Normal</option>
                      <option value="Congestion">Congestion</option>
                      <option value="Chemosis">Chemosis</option>
                      <option value="Subconjunctival Hemorrhage">Subconjunctival Hemorrhage</option>
                      <option value="Pterygium">Pterygium</option>
                      <option value="Pinguecula">Pinguecula</option>
                      <option value="Follicles">Follicles</option>
                      <option value="Papillae">Papillae</option>
                    </select>
                    
                    {/* <input
                      placeholder="Conjunctiva Left"
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.slit_lamp?.conj_le || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "conj_le", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    /> */}

                    <select
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.slit_lamp?.conj_le || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "conj_le", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    >
                      <option value="Normal">Normal</option>
                      <option value="Congestion">Congestion</option>
                      <option value="Chemosis">Chemosis</option>
                      <option value="Subconjunctival Hemorrhage">Subconjunctival Hemorrhage</option>
                      <option value="Pterygium">Pterygium</option>
                      <option value="Pinguecula">Pinguecula</option>
                      <option value="Follicles">Follicles</option>
                      <option value="Papillae">Papillae</option>
                    </select>

                    <p className="text-center font-semibold">Sclera</p>

                    {/* <input
                      placeholder="Sclera Right"
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.slit_lamp?.sclera_re || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "sclera_re", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    /> */}
                    <select
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.slit_lamp?.sclera_re || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "sclera_re", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    >
                      
                      <option value="Normal">Normal</option>
                      <option value="Icterus">Icterus</option>
                      <option value="Blue Sclera">Blue Sclera</option>
                      <option value="Scleritis">Scleritis</option>
                      <option value="Episcleritis">Episcleritis</option>
                      <option value="Thinning">Thinning</option>
                      <option value="Staphyloma">Staphyloma</option>
                      <option value="Pigmentation">Pigmentation</option>                      
                    </select>
                    {/* 
                    <input
                      placeholder="Sclera Left"
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.slit_lamp?.sclera_le || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "sclera_le", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    /> */}
                    <select
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.slit_lamp?.sclera_le || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "sclera_le", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    >
                      
                      <option value="Normal">Normal</option>
                      <option value="Icterus">Icterus</option>
                      <option value="Blue Sclera">Blue Sclera</option>
                      <option value="Scleritis">Scleritis</option>
                      <option value="Episcleritis">Episcleritis</option>
                      <option value="Thinning">Thinning</option>
                      <option value="Staphyloma">Staphyloma</option>
                      <option value="Pigmentation">Pigmentation</option>                      
                    </select>
                    <p className="text-center font-semibold">Cornea</p>

                    {/* <input
                      placeholder="Cornea Right"
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.slit_lamp?.cornea_re || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "cornea_re", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    /> */}

                    <select
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.slit_lamp?.cornea_re || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "cornea_re", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    >
                      <option value="Clear">Clear</option>
                      <option value="Nebular Opacity">Nebular Opacity</option>
                      <option value="Macular Opacity">Macular Opacity</option>
                      <option value="Leucoma">Leucoma</option>
                      <option value="Ulcer">Ulcer</option>
                      <option value="Scar">Scar</option>
                      <option value="Edema">Edema</option>
                      <option value="Keratitis">Keratitis</option>
                      <option value="Foreign Body">Foreign Body</option>
                      <option value="Pterygium">Pterygium</option>
                      <option value="Dry Eye">Dry Eye</option>
                    </select>

                    {/* <input
                      placeholder="Cornea Left"
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.slit_lamp?.cornea_le || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "cornea_le", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    /> */}

                    <select
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.slit_lamp?.cornea_le || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "cornea_le", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    >
                      <option value="Clear">Clear</option>
                      <option value="Nebular Opacity">Nebular Opacity</option>
                      <option value="Macular Opacity">Macular Opacity</option>
                      <option value="Leucoma">Leucoma</option>
                      <option value="Ulcer">Ulcer</option>
                      <option value="Scar">Scar</option>
                      <option value="Edema">Edema</option>
                      <option value="Keratitis">Keratitis</option>
                      <option value="Foreign Body">Foreign Body</option>
                      <option value="Pterygium">Pterygium</option>
                      <option value="Dry Eye">Dry Eye</option>
                    </select>

                    <p className="text-center font-semibold">Anterior Chamber</p>

                    {/* <input
                      placeholder="Anterior Chamber Right"
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.slit_lamp?.ac_re || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "ac_re", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    /> */}
                    <select
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.slit_lamp?.ac_re || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "ac_re", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    >
                      <option value="Normal in contact and depth PACD=1CT">Normal in contact and depth PACD=1CT</option>
                      <option value="Deep & Quiet">Deep & Quiet</option>
                      <option value="Shallow">Shallow</option>
                      <option value="Cells +">Cells +</option>
                      <option value="Cells ++">Cells ++</option>
                      <option value="Flare +">Flare +</option>
                      <option value="Flare ++">Flare ++</option>
                      <option value="Hypopyon">Hypopyon</option>
                      <option value="Hyphema">Hyphema</option>
                    </select>

                    {/* <input
                      placeholder="Anterior Chamber Left"
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.slit_lamp?.ac_le || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "ac_le", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    /> */}

                    <select
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.slit_lamp?.ac_le || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "ac_le", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    >
                      <option value="Normal in contact and depth PACD=1CT">Normal in contact and depth PACD=1CT</option>
                      <option value="Deep & Quiet">Deep & Quiet</option>
                      <option value="Shallow">Shallow</option>
                      <option value="Cells +">Cells +</option>
                      <option value="Cells ++">Cells ++</option>
                      <option value="Flare +">Flare +</option>
                      <option value="Flare ++">Flare ++</option>
                      <option value="Hypopyon">Hypopyon</option>
                      <option value="Hyphema">Hyphema</option>
                    </select>

                    <p className="text-center font-semibold">Iris</p>

                    {/* <input
                      placeholder="Iris Right"
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.slit_lamp?.iris_re || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "iris_re", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    /> */}

                    <select
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.slit_lamp?.iris_re || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "iris_re", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    >
               
                    <option value="Normal color and pattern">Normal color and pattern</option>
                    <option value="Coloboma">Coloboma</option>
                    <option value="Iridodialysis">Iridodialysis</option>
                    <option value="Posterior Synechiae">Posterior Synechiae</option>
                    <option value="Atrophy">Atrophy</option>
                    </select>

                    {/* <input
                      placeholder="Iris Left"
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.slit_lamp?.iris_le || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "iris_le", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    /> */}
                    <select
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.slit_lamp?.iris_le || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "iris_le", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    >
               
                    <option value="Normal color and pattern">Normal color and pattern</option>
                    <option value="Coloboma">Coloboma</option>
                    <option value="Iridodialysis">Iridodialysis</option>
                    <option value="Posterior Synechiae">Posterior Synechiae</option>
                    <option value="Atrophy">Atrophy</option>
                    </select>
                    <p className="text-center font-semibold">Pupil</p>

                    {/* <input
                      placeholder="Pupil Right"
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.slit_lamp?.pupil_re || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "pupil_re", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    /> */}

                    <select
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                       value={form.ocular_exam.slit_lamp?.pupil_re || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "pupil_re", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    >
                      <option value="Round, Regular and Reacting">Round, Regular and Reacting</option>
                      <option value="Round Reactive">Round Reactive</option>
                      <option value="Sluggish">Sluggish</option>
                      <option value="Fixed">Fixed</option>
                      <option value="Irregular">Irregular</option>
                      <option value="Dilated">Dilated</option>
                      <option value="Miotic">Miotic</option>
                      <option value="RAPD Positive">RAPD Positive</option>
                    </select>

                    {/* <input
                      placeholder="Pupil Left"
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.slit_lamp?.pupil_le || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "pupil_le", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    /> */}
                    <select
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                       value={form.ocular_exam.slit_lamp?.pupil_le || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "slit_lamp", "pupil_le", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    >
                      <option value="Round, Regular and Reacting">Round, Regular and Reacting</option>
                      <option value="Round Reactive">Round Reactive</option>
                      <option value="Sluggish">Sluggish</option>
                      <option value="Fixed">Fixed</option>
                      <option value="Irregular">Irregular</option>
                      <option value="Dilated">Dilated</option>
                      <option value="Miotic">Miotic</option>
                      <option value="RAPD Positive">RAPD Positive</option>
                    </select>

                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 mb-4">
                    <></>

                    <input
                      type="text"
                      placeholder="Right Eye Comment"
                      className="border rounded-lg p-2"
                      value={form.ocular_exam.slit_lamp?.slit_re_comment || ""}
                      onChange={(e) =>
                        updateNested(
                          "ocular_exam",
                          "slit_lamp",
                          "slit_re_comment",
                          e.target.value
                        )
                      }
                      onKeyDown={handleEnterNext}
                    />

                    <input
                      type="text"
                      placeholder="Left Eye Comment"
                      className="border rounded-lg p-2"
                      value={form.ocular_exam.slit_lamp?.slit_le_comment || ""}
                      onChange={(e) =>
                        updateNested(
                          "ocular_exam",
                          "slit_lamp",
                          "slit_le_comment",
                          e.target.value
                        )
                      }
                      onKeyDown={handleEnterNext}
                    />

                  </div>


                </div>

                {/* 🔹 IOP */}
                <div>
                  <p className="font-semibold">IOP</p>

                  <div className="grid grid-cols-5 gap-4 items-center">

                    <select
                      value={form.ocular_exam.iop?.method || ""}
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onChange={(e) =>
                        updateNested("ocular_exam", "iop", "method", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    >
                      <option value="">Select Method</option>
                      <option value="NCT">NCT</option>
                      <option value="AT">AT</option>
                    </select>

                    <input
                      placeholder="Right Eye"
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.iop?.re || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "iop", "re", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    />

                    <input
                      placeholder="Left Eye"
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.iop?.le || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "iop", "le", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    />
                   
                    <div className="text-l text-gray-700 text-center">
                      mmHg at
                    </div>
                    <input
                      placeholder="Time"
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.iop?.time || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "iop", "time", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    />


                  </div>
                </div>

                {/* 🔥 LACRIMAL */}
                {/* <div>
                  <p className="font-semibold">Lacrimal Patency</p>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Right Eye"
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.lacrimal?.re || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "lacrimal", "re", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    />
                    <input
                      placeholder="Left Eye"
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.lacrimal?.le || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "lacrimal", "le", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    />
                  </div>
                </div> */}
                <div>
                  <p className="font-semibold">Lacrimal Patency</p>

                  <div className="grid grid-cols-2 gap-2">

                    {/* Right Eye */}
                    <select
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.lacrimal?.re || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "lacrimal", "re", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    >
                      <option value="">Right Eye</option>
                      <option value="Patent">Patent</option>
                      <option value="Partially Patent">Partially Patent</option>
                      <option value="Blocked">Blocked</option>
                      <option value="Regurgitation Positive">Regurgitation Positive</option>
                      <option value="Regurgitation Negative">Regurgitation Negative</option>
                      <option value="Dacryocystitis">Dacryocystitis</option>
                    </select>

                    {/* Left Eye */}
                    <select
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.lacrimal?.le || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "lacrimal", "le", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    >
                      <option value="">Left Eye</option>
                      <option value="Patent">Patent</option>
                      <option value="Partially Patent">Partially Patent</option>
                      <option value="Blocked">Blocked</option>
                      <option value="Regurgitation Positive">Regurgitation Positive</option>
                      <option value="Regurgitation Negative">Regurgitation Negative</option>
                      <option value="Dacryocystitis">Dacryocystitis</option>
                    </select>

                    {/* Comment */}
                    <input
                      type="text"
                      placeholder="Comment"
                      className="border rounded-lg p-2 col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.ocular_exam.lacrimal?.comment || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "lacrimal", "comment", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                    />

                  </div>
                </div>


                <div>


                  <p className="font-semibold">Schirmer Test</p>

                  <div className="grid grid-cols-3 gap-2">

                    {/* Type */}
                    <select
                      value={form.ocular_exam.schirmer?.type || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "schirmer", "type", e.target.value)
                      }
                      className="border rounded-lg p-2"
                      onKeyDown={handleEnterNext}
                    >
                      <option value="">Type</option>
                      <option value="Type I">Type I</option>
                      <option value="Type II">Type II</option>
                    </select>

                    {/* Time */}
                    <select
                      value={form.ocular_exam.schirmer?.time || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "schirmer", "time", e.target.value)
                      }
                      className="border rounded-lg p-2"
                      onKeyDown={handleEnterNext}
                    >
                      <option value="">Time</option>
                      <option value="2 min">2 min</option>
                      <option value="3 min">3 min</option>
                      <option value="5 min">5 min</option>
                    </select>

                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <input
                      placeholder="Right Eye (mm)"
                      value={form.ocular_exam.schirmer?.re || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "schirmer", "re", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                      className="border rounded-lg p-2"
                    />


                    <input
                      placeholder="Left Eye (mm)"
                      value={form.ocular_exam.schirmer?.le || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "schirmer", "le", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                      className="border rounded-lg p-2"
                    />
                  </div>


                </div>

                {/* <div>


                  <p className="font-semibold">Colour Vision</p>

                  <div className="grid grid-cols-2 gap-2">

                    <select
                      value={form.ocular_exam.color_vision?.re || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "color_vision", "re", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                      className="border rounded-lg p-2"
                    >
                      <option value="">Right Eye</option>
                      <option value="Normal">Normal</option>
                      <option value="Defective">Defective</option>
                    </select>

                    <select
                      value={form.ocular_exam.color_vision?.le || ""}
                      onChange={(e) =>
                        updateNested("ocular_exam", "color_vision", "le", e.target.value)
                      }
                      onKeyDown={handleEnterNext}
                      className="border rounded-lg p-2"
                    >
                      <option value="">Left Eye</option>
                      <option value="Normal">Normal</option>
                      <option value="Defective">Defective</option>
                    </select>

                  </div>

                </div> */}

              </div>
            )}
          </div>
          {/* <div className="border p-3 rounded">
            <div
              onClick={() => toggleSection("fundus")}
              className="font-bold cursor-pointer"
            >
              FUNDUS AND PRESCRIPTION ⬇
            </div>

            {openSection === "fundus" && (
              <div className="mt-3 space-y-4"> */}
          <div className="bg-white rounded-xl shadow">

            <div
              onClick={() => toggleSection("fundus")}
              className="flex justify-between items-center p-4 font-semibold text-blue-900 cursor-pointer"
            >
              FUNDUS AND PRESCRIPTION 
              <span>{openSection === "fundus" ? "▲" : "▼"}</span>
            </div>

            {openSection === "fundus" && (
              <div className="p-4 border-t">
                {/* 🔹 FUNDUS */}
                <div className="mb-4">
                  <p className="font-semibold">Fundus Examination</p>

                  <div className="grid grid-cols-3 gap-2">

                    <div></div>
                    <p className="text-center font-semibold">Right Eye</p>
                    <p className="text-center font-semibold">Left Eye</p>

                    {/* MEDIA */}
                    <p>Media</p>
                    <input
                      value={form.fundus.media_re || ""}
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          fundus: { ...form.fundus, media_re: e.target.value }
                        })
                      }
                      onKeyDown={handleEnterNext}
                    />
                    <input
                      value={form.fundus.media_le || ""}
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          fundus: { ...form.fundus, media_le: e.target.value }
                        })
                      }
                      onKeyDown={handleEnterNext}
                    />

                    {/* PVD */}
                    <p>PVD</p>
                    <input
                      value={form.fundus.pvd_re || ""}
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          fundus: { ...form.fundus, pvd_re: e.target.value }
                        })
                      }onKeyDown={handleEnterNext}
                    />
                    <input
                      value={form.fundus.pvd_le || ""}
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          fundus: { ...form.fundus, pvd_le: e.target.value }
                        })
                      }
                      onKeyDown={handleEnterNext}
                    />

                    {/* CDR */}
                    <p>CDR</p>
                    <input
                      value={form.fundus.cdr_re || ""}
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          fundus: { ...form.fundus, cdr_re: e.target.value }
                        })
                      }
                      onKeyDown={handleEnterNext}
                    />
                    <input
                      value={form.fundus.cdr_le || ""}
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          fundus: { ...form.fundus, cdr_le: e.target.value }
                        })
                      }
                      onKeyDown={handleEnterNext}
                    />

                    {/* OPTIC DISC */}
                    <p>Optic Disc</p>
                    <input
                      value={form.fundus.optic_re || ""}
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          fundus: { ...form.fundus, optic_re: e.target.value }
                        })
                      }
                      onKeyDown={handleEnterNext}
                    />
                    <input
                      value={form.fundus.optic_le || ""}
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          fundus: { ...form.fundus, optic_le: e.target.value }
                        })
                      }
                      onKeyDown={handleEnterNext}
                    />

                  </div>
                </div>

                {/* 🔹 DIAGNOSIS */}
                {/* <div className="mb-4">
                  <p className="font-semibold mb-4">Diagnosis</p>

                  <div className="grid grid-cols-2 gap-4 mb-4 ">

                    <input
                      placeholder="Right Eye"
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.fundus.diagnosis_re || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          fundus: { ...form.fundus, diagnosis_re: e.target.value }
                        })
                      }
                      onKeyDown={handleEnterNext}
                    />

                    <input
                      placeholder="Left Eye"
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.fundus.diagnosis_le || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          fundus: { ...form.fundus, diagnosis_le: e.target.value }
                        })
                      }
                      onKeyDown={handleEnterNext}
                    />

                  </div>
                </div> */}
                <div className="mb-4">
                  <p className="font-semibold mb-4">Diagnosis</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">

                    {/* Right Eye */}
                    <select
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.fundus.diagnosis_re || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          fundus: {
                            ...form.fundus,
                            diagnosis_re: e.target.value,
                          },
                        })
                      }
                      onKeyDown={handleEnterNext}
                    >
                      <option value="">Right Eye Diagnosis</option>
                      <option value="Normal">Normal</option>
                      <option value="Refractive Error">Refractive Error</option>
                      <option value="Myopia">Myopia</option>
                      <option value="Hypermetropia">Hypermetropia</option>
                      <option value="Astigmatism">Astigmatism</option>
                      <option value="Presbyopia">Presbyopia</option>
                      <option value="Cataract">Cataract</option>
                      <option value="Pseudophakia">Pseudophakia</option>
                      <option value="Aphakia">Aphakia</option>
                      <option value="Glaucoma">Glaucoma</option>
                      <option value="Diabetic Retinopathy">Diabetic Retinopathy</option>
                      <option value="Hypertensive Retinopathy">Hypertensive Retinopathy</option>
                      <option value="Age Related Macular Degeneration">Age Related Macular Degeneration</option>
                      <option value="Macular Edema">Macular Edema</option>
                      <option value="Retinal Detachment">Retinal Detachment</option>
                      <option value="Retinal Vein Occlusion">Retinal Vein Occlusion</option>
                      <option value="Retinal Artery Occlusion">Retinal Artery Occlusion</option>
                      <option value="Optic Atrophy">Optic Atrophy</option>
                      <option value="Optic Neuritis">Optic Neuritis</option>
                      <option value="Papilledema">Papilledema</option>
                      <option value="Corneal Ulcer">Corneal Ulcer</option>
                      <option value="Keratitis">Keratitis</option>
                      <option value="Dry Eye">Dry Eye</option>
                      <option value="Conjunctivitis">Conjunctivitis</option>
                      <option value="Uveitis">Uveitis</option>
                    </select>

                    {/* Left Eye */}
                    <select
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.fundus.diagnosis_le || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          fundus: {
                            ...form.fundus,
                            diagnosis_le: e.target.value,
                          },
                        })
                      }
                      onKeyDown={handleEnterNext}
                    >
                      <option value="">Left Eye Diagnosis</option>
                      <option value="Normal">Normal</option>
                      <option value="Refractive Error">Refractive Error</option>
                      <option value="Myopia">Myopia</option>
                      <option value="Hypermetropia">Hypermetropia</option>
                      <option value="Astigmatism">Astigmatism</option>
                      <option value="Presbyopia">Presbyopia</option>
                      <option value="Cataract">Cataract</option>
                      <option value="Pseudophakia">Pseudophakia</option>
                      <option value="Aphakia">Aphakia</option>
                      <option value="Glaucoma">Glaucoma</option>
                      <option value="Diabetic Retinopathy">Diabetic Retinopathy</option>
                      <option value="Hypertensive Retinopathy">Hypertensive Retinopathy</option>
                      <option value="Age Related Macular Degeneration">Age Related Macular Degeneration</option>
                      <option value="Macular Edema">Macular Edema</option>
                      <option value="Retinal Detachment">Retinal Detachment</option>
                      <option value="Retinal Vein Occlusion">Retinal Vein Occlusion</option>
                      <option value="Retinal Artery Occlusion">Retinal Artery Occlusion</option>
                      <option value="Optic Atrophy">Optic Atrophy</option>
                      <option value="Optic Neuritis">Optic Neuritis</option>
                      <option value="Papilledema">Papilledema</option>
                      <option value="Corneal Ulcer">Corneal Ulcer</option>
                      <option value="Keratitis">Keratitis</option>
                      <option value="Dry Eye">Dry Eye</option>
                      <option value="Conjunctivitis">Conjunctivitis</option>
                      <option value="Uveitis">Uveitis</option>
                    </select>

                    {/* Comment */}
                    <input
                      type="text"
                      placeholder="Diagnosis Comment"
                      className="border rounded-lg p-2 col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.fundus.diagnosis_comment || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          fundus: {
                            ...form.fundus,
                            diagnosis_comment: e.target.value,
                          },
                        })
                      }
                      onKeyDown={handleEnterNext}
                    />

                  </div>
                </div>
                {/* 🔥 CLINICAL IMPRESSION */}
                <div className="mb-4">

                  <p className="font-semibold mb-2">Clinical impression</p>
                <textarea
                  // className={`border p-2 w-full ${errors.clinical ? "border-red-500" : ""}`}
                  
                  className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-sm resize-none ${errors.clinical ? "border-red-500" : ""}`}
                  placeholder="Clinical Impression"
                  value={form.clinical_impression || ""}
                  onChange={(e) =>
                    setForm({ ...form, clinical_impression: e.target.value })
                  }
                  onKeyDown={handleEnterNext}
                />
                </div>

                {/* 🔥 ADVICE */}
                <textarea
                  placeholder="Advice"
                  className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-sm resize-none"
                  value={form.advice || ""}
                  onChange={(e) =>
                    setForm({ ...form, advice: e.target.value })
                  }
                  onKeyDown={handleEnterNext}
                />

                {/* 🔥 NEXT VISIT REASON */}
                <input
                  placeholder="Next Visit Reason"
                  className="border rounded-lg p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.next_visit_reason || ""}
                  onChange={(e) =>
                    setForm({ ...form, next_visit_reason: e.target.value })
                  }
                  onKeyDown={handleEnterNext}
                />

                {/* 🔥 PRESCRIPTION */}
                <div className="mb-4">
                  <p className="font-semibold mb-4 ">Prescription</p>
                  {form.prescriptions.map((p, i) => (
                    <div key={i} className="grid grid-cols-6 gap-3 mb-3">

                      {/* ✅ TYPE (same as V1) */}
                      <select
                        
                        data-med
                        className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={p.type || ""}
                        onChange={(e) => {
                          const updated = [...form.prescriptions];
                          updated[i].type = e.target.value;
                          updated[i].medicine_id = ""; // reset medicine when type changes
                          setForm({ ...form, prescriptions: updated });
                        }}
                        onKeyDown={handleEnterNext}
                      >
                        <option value="">Select Type</option>
                        <option value="tablet">Tablet</option>
                        <option value="syrup">Syrup</option>
                        <option value="eye_drop">Eye Drop</option>
                      </select>

                      {/* ✅ MEDICINE (filtered like V1) */}
                      <select
                        // className={`border p-2 ${errors.prescription ? "border-red-500" : ""}`}
                        className={`border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.prescription ? "border-red-500" : ""}`}
                        value={p.medicine_id || ""}
                        onChange={(e) => {
                          const updated = [...form.prescriptions];
                          updated[i].medicine_id = Number(e.target.value);
                          setForm({ ...form, prescriptions: updated });
                        }}
                        onKeyDown={handleEnterNext}
                      >
                        <option value="">Select Medicine</option>

                        {medicines
                          .filter(m => m.type === p.type)
                          .map(m => (
                            <option key={m.id} value={m.id}>
                              {m.name}
                            </option>
                          ))}
                      </select>

                      {/* DOSAGE */}
                      <input
                        placeholder="Dosage"
                        // className={`border p-2 ${errors.prescription ? "border-red-500" : ""}`}
                        className={`border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.prescription ? "border-red-500" : ""}`}
                        value={p.dosage || ""}
                        onChange={(e) => {
                          const updated = [...form.prescriptions];
                          updated[i].dosage = e.target.value;
                          setForm({ ...form, prescriptions: updated });
                        }}
                        onKeyDown={handleEnterNext}
                      />

                      {/* DURATION */}
                      <input
                        placeholder="Duration"
                        className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={p.duration || ""}
                        onChange={(e) => {
                          const updated = [...form.prescriptions];
                          updated[i].duration = e.target.value;
                          setForm({ ...form, prescriptions: updated });
                        }}
                        onKeyDown={handleEnterNext}
                      />

                      {/* INSTRUCTIONS */}
                      <input
                        placeholder="Instructions"
                        className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={p.instructions || ""}
                        onChange={(e) => {
                          const updated = [...form.prescriptions];
                          updated[i].instructions = e.target.value;
                          setForm({ ...form, prescriptions: updated });
                        }}
                        onKeyDown={handleEnterNext}
                      />
                      <button
                        onClick={() => {
                          const updated = form.prescriptions.filter((_, idx) => idx !== i);
                          setForm({ ...form, prescriptions: updated });
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
                      >
                        X
                      </button>

                    </div>
                  ))}


                  <button
                  
                    onClick={() => {
                      const updated = [...form.prescriptions, {}];
                      setForm({ ...form, prescriptions: updated });

                      setTimeout(() => {
                        const inputs = document.querySelectorAll("[data-med]");
                        inputs[inputs.length - 1]?.focus();
                      }, 100);
                    }}
                    

                    className="bg-blue-600 mb-4 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow"
                  >
                    + Add Medicine
                  </button>
                </div>

                {/* 🔹 NEXT VISIT */}
                <p className="font-semibold mb-2 ">Next visit date</p>
                <input
                  type="date"
                  value={form.next_visit_date || ""}
                  className="border rounded-lg p-2 w-70 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onChange={(e) =>
                    setForm({ ...form, next_visit_date: e.target.value })
                  }
                  onKeyDown={handleEnterNext}
                />

              </div>
            )}
          </div>
          <div className="flex justify-between mt-6">
            
            <button
              onClick={() => {
                if (!patient) {
                  // alert("No patient ❌");
                  setMessage({ type: "error", text: "No patient ❌" });
                  return;
                }
                window.print();
              }}
              // className="bg-gray-800 text-white px-4 py-2 rounded"
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-2 rounded-xl shadow"
            >
              Print
            </button>
            <button
              onClick={handleSave}
              // className="bg-blue-600 text-white px-6 py-2 rounded"
              className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-8 py-2 rounded-xl shadow"

              disabled={loadingSave}
            >

            {loadingSave ? "Saving..." : "SAVE"}
            </button>
          </div>



        </div>


        {/* RIGHT HISTORY PANEL */}
        {/* <div className="w-[25%] bg-white rounded-xl shadow flex flex-col h-[120vh] no-print"> */}
        <div className="flex-[1] bg-white rounded-xl shadow flex flex-col h-[120vh] no-print">
          
          <div className="p-4 border-b sticky top-0 bg-white z-10">
            <h2 className="text-lg font-bold text-blue-900">
              History Section
            </h2>
          </div>
          {history.length === 0 && (

            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
              <p>📄 No history available</p>
            </div>

            
          )}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">

            {history.map((h, i) => (
              
              <div
                key={i}
                className={`p-4 mb-4 rounded-xl border shadow-sm text-xs space-y-3
                ${i === 0 ? "bg-blue-50 border-blue-300" : "bg-white"}`}
              >  

              
                            
                <div className="flex justify-between">
                  <p className="font-semibold text-blue-700">
                    {new Date(h.diagnosis.created_at).toLocaleDateString()}
                  </p>
                  <p>{h.doctor_name || "Doctor"}</p>
                </div>

                {/* CHIEF COMPLAINT */}
                <div>
                  <b>C/O:</b>
                  {h.diagnosis.chief_complaints?.map((c,i)=>(
                    <p key={i}>• {c.complaint} ({c.eye}) - {c.duration}</p>
                  ))}
                </div>

                {/* SYSTEMIC */}
                <div>
                  <b>Systemic:</b>
                  {h.diagnosis.systemic_history?.map((s,i)=>(
                    <p key={i}>• {s.disease} ({s.duration})</p>
                  ))}
                </div>

                {/* REFRACTION */}
                <div>
                  <b>Refraction:</b>
                  <p>
                    RE: {h.diagnosis.refraction?.final_refraction?.re_sph} /
                    {h.diagnosis.refraction?.final_refraction?.re_cyl}
                  </p>
                  <p>
                    LE: {h.diagnosis.refraction?.final_refraction?.le_sph} /
                    {h.diagnosis.refraction?.final_refraction?.le_cyl}
                  </p>
                  
                </div>

                {/* SLIT LAMP */}
                <div>
                  <b>Slit Lamp:</b>
                  <p>Cornea RE: {h.diagnosis.ocular_exam?.slit_lamp?.cornea_re}</p>
                  <p>Cornea LE: {h.diagnosis.ocular_exam?.slit_lamp?.cornea_le}</p>
                </div>

                {/* IOP */}
                <div>
                  <b>IOP:</b>
                  RE {h.diagnosis.ocular_exam?.iop?.re} | 
                  LE {h.diagnosis.ocular_exam?.iop?.le}
                </div>

                {/* SCHIRMER */}
                <div>
                  <b>Schirmer:</b>
                  RE {h.diagnosis.ocular_exam?.schirmer?.re} |
                  LE {h.diagnosis.ocular_exam?.schirmer?.le}
                </div>

                {/* COLOR VISION */}
                <div>
                  <b>Color Vision:</b>
                  RE {h.diagnosis.ocular_exam?.color_vision?.re} |
                  LE {h.diagnosis.ocular_exam?.color_vision?.le}
                </div>

                {/* FUNDUS */}
                <div>
                  <b>Fundus:</b>
                  <p>CDR RE: {h.diagnosis.fundus?.cdr_re}</p>
                  <p>CDR LE: {h.diagnosis.fundus?.cdr_le}</p>
                </div>

                {/* DIAGNOSIS */}
                <div>
                  <b>Diagnosis:</b>
                  RE: {h.diagnosis.fundus?.diagnosis_re} |
                  LE: {h.diagnosis.fundus?.diagnosis_le}
                </div>

                {/* CLINICAL */}
                <div>
                  <b>Clinical:</b> {h.diagnosis.clinical_impression}
                </div>

                {/* ADVICE */}
                <div>
                  <b>Advice:</b> {h.diagnosis.advice}
                </div>

                {/* PRESCRIPTION */}
                <div>
                  <b>Rx:</b>
                  {h.prescriptions?.map((p,i)=>(
                    <p key={i}>
                      • {getMedicineName(p.medicine_id)} | {p.dosage} | {p.duration}
                    </p>
                  ))}
                </div>

                {/* NEXT VISIT */}
                {h.diagnosis.next_visit_date && (
                  <div className="text-blue-600">
                    Next: {h.diagnosis.next_visit_date} ({h.diagnosis.next_visit_reason})
                  </div>
                )}
              </div>


            ))}

          </div>


        </div>
      </div>

        <div className="print-area-v2">

          <div className="a4-page">

            {/* 🔷 HEADER */}
            <div className="header">
              <h1>Eye Clinic Name</h1>
              <p>Doctor Name | Reg No</p>
            </div>

            {/* 🔷 PATIENT INFO */}
            
            {patient && (
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


            
            {/* 🔷 CHIEF COMPLAINT */}
            <div className="section">
              <h3>Chief Complaints</h3>
              

              {printData?.chief_complaints?.length > 0 ? (
                printData.chief_complaints
                  .filter(c => c.complaint)
                  .map((c, i) => (
                    <p key={i}>
                      {c.complaint || "-"} ({c.eye || "-"}) - {c.duration || "-"}
                    </p>
                  ))
              ) : (
                <p>-</p>
              )}

            </div>

            {/* 🔷 REFRACTION */}
            <div className="section">
              <h3>Refraction</h3>

              <p><b>Unaided:</b></p>
              {/* <p>
                RE: {form.refraction?.unaided?.re_distance || "-"} /
                {form.refraction?.unaided?.re_near || "-"}
              </p>
               */}
              <p>
                RE: {printData?.refraction?.unaided?.re_distance || "-"} /
                {printData?.refraction?.unaided?.re_near || "-"}
              </p>

              <p>
                LE: {printData?.refraction?.unaided?.le_distance || "-"} /
                {printData?.refraction?.unaided?.le_near || "-"}
              </p>
              <p><b>Final:</b></p>
              <p>
                {/* RE: {form.refraction?.final_refraction?.re_sph || "-"} /
                {form.refraction?.final_refraction?.re_cyl || "-"} ×
                {form.refraction?.final_refraction?.re_axis || "-"} */}
                RE: {printData?.refraction?.final_refraction?.re_sph || "-"} /
                {printData?.refraction?.final_refraction?.re_cyl || "-"} ×
                {printData?.refraction?.final_refraction?.re_axis || "-"}

              </p>
              <p>
                {/* LE: {form.refraction?.final_refraction?.le_sph || "-"} /
                {form.refraction?.final_refraction?.le_cyl || "-"} ×
                {form.refraction?.final_refraction?.le_axis || "-"} */}
                LE: {printData?.refraction?.final_refraction?.le_sph || "-"} /
                {printData?.refraction?.final_refraction?.le_cyl || "-"} ×
                {printData?.refraction?.final_refraction?.le_axis || "-"}

              </p>
            </div>

            {/* 🔷 OCULAR */}
            <div className="section">
              <h3>Ocular Examination</h3>

              <p>
                
                IOP: RE {printData?.ocular_exam?.iop?.re || "-"} /
                LE {printData?.ocular_exam?.iop?.le || "-"}
              </p>

              <p>
                Cornea: RE {printData?.ocular_exam?.slit_lamp?.cornea_re || "-"} /
                LE {printData?.ocular_exam?.slit_lamp?.cornea_le || "-"}
              </p>
            </div>

            {/* 🔷 FUNDUS */}
            <div className="section">
              <h3>Fundus</h3>

              <p>
                CDR: RE {printData?.fundus?.cdr_re || "-"} /
                LE {printData?.fundus?.cdr_le || "-"}
              </p>

              <p>
                Diagnosis: {printData?.fundus?.diagnosis_re || "-"} /
                {printData?.fundus?.diagnosis_le || "-"}
              </p>
            </div>

            {/* 🔷 CLINICAL */}
            <div className="section">
              <h3>Clinical Impression</h3>
              <p>{printData?.clinical_impression || "-"}</p>
            </div>

            {/* 🔷 ADVICE */}
            <div className="section">
              <h3>Advice</h3>
              <p>{printData?.advice || "-"}</p>
            </div>

            {/* 🔷 PRESCRIPTION */}
            <div className="section">
              <h3>Prescription</h3>

              {printData?.prescriptions.length > 0 ? (
                <table>
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
                  
                    {printData?.prescriptions
                      .filter(p => p.medicine_id && p.dosage)
                      .map((p, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{getMedicineName(p.medicine_id) || "-"}</td>
                        

                        <td>
                          {p.type === "eye_drop"
                            ? "Eye Drop"
                            : p.type?.charAt(0).toUpperCase() + p.type?.slice(1) || "-"}
                        </td>

                        <td>{p.dosage || "-"}</td>
                        <td>{p.duration || "-"}</td>
                        <td>{p.instructions || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>-</p>
              )}
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
