import { useState, useEffect } from "react";
import api from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { useRef } from "react";




function ReAppointment() {
  const navigate = useNavigate(); 
  const doctorRef = useRef();
  const codeRef = useRef();
  const [code, setCode] = useState("");
  const [patient, setPatient] = useState(null);
  const [lastData, setLastData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [history, setHistory] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [appointment, setAppointment] = useState({
    doctor_id: "",
    date: "",
    time: "",
    notes: ""
  });
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [error, setError] = useState("");

  const [searching, setSearching] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [savingAppointment, setSavingAppointment] = useState(false);
  const [errors, setErrors] = useState({});


  useEffect(() => {
    if (appointment.doctor_id && appointment.date) {
      fetchSlots(appointment.doctor_id, appointment.date);
    }
  }, [appointment.doctor_id, appointment.date]);

  // useEffect(() => {
  //   const fetchDoctors = async () => {
  //     const res = await api.get("/users/doctors");
  //     setDoctors(res.data);
  //   };
  //   fetchDoctors();
  // }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      setError("");

      try {
        const res = await api.get("/users/doctors");
        setDoctors(res.data);
      } catch (err) {
        console.error(err);

        if (!err.response) {
          setError("Unable to connect to the server.");
        } else if (err.response.status === 401) {
          setError("Session expired. Please login again.");
        } else {
          setError("Unable to load doctors.");
        }
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  // const handleSearch = async () => {
  //   try {
  //     const res = await api.get(`/patients/search-list/${code}`);
  //     setSearchResults(res.data);
  //   } catch (err) {
  //     setSearchResults([]);
  //     alert("No patient found");
  //   }
  // };

  const handleSearch = async () => {
      if (!code.trim()) {
          setError("Please enter Patient ID, Name, Phone, or Address.");
          setSearchResults([]);
          return;
      }
      setSearching(true);
      try {
          const res = await api.get(`/patients/search-list/${code}`);
          setSearchResults(res.data);
          setError("");
      } catch (err) {
          console.error(err);
          setSearchResults([]);

          if (!err.response) {
              setError("Unable to connect to the server.");
          } else if (err.response.status === 404) {
              setError("No patient found.");
          } else if (err.response.status === 401) {
              setError("Session expired. Please login again.");
          } else {
              setError("Unable to search patients.");
          }
      }finally {
          setSearching(false);
      }
  }
  const selectPatient = async (selectedPatient) => {
    try {
      setPatient(selectedPatient);

      const last = await api.get(`/appointments/last/${selectedPatient.id}`);
      setLastData(last.data);

      const hist = await api.get(`/diagnosis/patient/${selectedPatient.id}`);
      setHistory(hist.data);

      setSearchResults([]);
      setCode(selectedPatient.name);
      setError("");
    } 

    catch (err) {
        console.error(err);

        if (!err.response) {
            setError("Unable to connect to the server.");
        } else if (err.response.status === 404) {
            setError("Patient details not found.");
        } else if (err.response.status === 401) {
            setError("Session expired. Please login again.");
        } else {
            setError("Unable to load patient details.");
        }
    }

  };
  const [slots, setSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  

  useEffect(() => {
    setSlots(generateSlots());
  }, []);

  
  // const fetchSlots = async (doctorId, date) => {
  //   const res = await api.get(`/appointments/by-date?doctor_id=${doctorId}&date=${date}`);

  //   const formatted = res.data.map(t => t.slice(0, 5));
  //   setBookedSlots(formatted);
  // };

  const fetchSlots = async (doctorId, date) => {
    setLoadingSlots(true);
      try {
          const res = await api.get(
              `/appointments/by-date?doctor_id=${doctorId}&date=${date}`
          );

          const formatted = res.data.map((t) => t.slice(0, 5));
          setBookedSlots(formatted);
          setError("");
      } catch (err) {
          console.error(err);
          setBookedSlots([]);

          if (!err.response) {
              setError("Unable to connect to the server.");
          } else if (err.response.status === 401) {
              setError("Session expired. Please login again.");
          } else {
              setError("Unable to load appointment slots.");
          }
      }finally {
          setLoadingSlots(false);
      }
  };


  const generateSlots = () => {
    const slots = [];
    let start = 9 * 60;   // 9:00 in minutes
    let end = 21 * 60;    // 7:00 PM

    for (let t = start; t < end; t += 20) {
      const hours = Math.floor(t / 60);
      const minutes = t % 60;

      const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
      slots.push(time);
    }

    return slots;
  };
 
  const handleReAppointment = async () => {

  const validationErrors = {};

  if (!patient) {
      setError("Please select a patient.");
      return;
  }

  if (!appointment.doctor_id) {
      validationErrors.doctor_id = "Please select a doctor.";
  }

  if (!appointment.date) {
      validationErrors.date = "Please select an appointment date.";
  }

  if (!appointment.time) {
      validationErrors.time = "Please select an appointment time.";
  }

  if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
  }

  setErrors({});
  setError("");
  if (savingAppointment) return;


  setSavingAppointment(true);
    try {
      await api.post("/appointments/", {
        patient_id: patient.id,
        doctor_id: appointment.doctor_id,
        date: appointment.date,
        time: appointment.time,
        notes: appointment.notes
      });
      setError("");
      

      // 🔥 WhatsApp Message
      const doctorName = doctors.find(d => d.id == appointment.doctor_id)?.name;
          
const message = `
Dear ${patient.name},

Greetings from *S&D Eye Care Centre*.

Your *re-appointment has been successfully confirmed.*

━━━━━━━━━━━━━━━━━━
🆔 *Patient ID:* ${patient.patient_code}
👨‍⚕️ *Consulting Doctor:* ${doctorName}
📅 *Appointment Date:* ${appointment.date}
🕒 *Appointment Time:* ${appointment.time}
━━━━━━━━━━━━━━━━━━

Please arrive *10 minutes before* your appointment.

Kindly bring:
• Previous prescription
• Medical reports (if any)
• Current spectacles/contact lenses

If you are unable to visit on the scheduled date and time, please let us know in advance so we can arrange another appointment for you.

Thank you for choosing *S&D Eye Care Centre*.

📍 S&D Eye Care Centre
📞 +91 8077799516

We look forward to welcoming you.

━━━━━━━━━━━━━━━━━━

प्रिय ${patient.name} जी,

*एस एंड डी आई केयर सेंटर* की ओर से नमस्कार।

आपका *दोबारा अपॉइंटमेंट सफलतापूर्वक बुक हो गया है।*

━━━━━━━━━━━━━━━━━━
👨‍⚕️ *डॉक्टर:* ${doctorName}
📅 *अपॉइंटमेंट की तारीख:* ${appointment.date}
🕒 *अपॉइंटमेंट का समय:* ${appointment.time}
━━━━━━━━━━━━━━━━━━

कृपया अपने अपॉइंटमेंट के समय से *10 मिनट पहले* क्लिनिक पहुँचें।

कृपया अपने साथ लाएँ:
• पिछला पर्चा (Prescription)
• मेडिकल रिपोर्ट (यदि हो)
• अपना वर्तमान चश्मा या कॉन्टैक्ट लेंस

यदि आप तय समय पर नहीं आ सकते हैं, तो कृपया पहले से हमें सूचित करें ताकि आपके लिए नया अपॉइंटमेंट तय किया जा सके।

*एस एंड डी आई केयर सेंटर* पर भरोसा करने के लिए आपका धन्यवाद।

📍 एस एंड डी आई केयर सेंटर
📞 +91 8077799516

हम आपके स्वागत के लिए तत्पर हैं।
`;

      const phone = patient.phone?.replace(/\D/g, "");

      if (phone) {
          const url = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;

          const popup = window.open(url, "_blank");

          if (!popup || popup.closed) {
              alert(
                  "Appointment scheduled successfully, but WhatsApp could not be opened."
              );
          } else {
              alert("Appointment scheduled successfully.");
          }
      } else {
          alert(
              "Appointment scheduled successfully, but WhatsApp could not be opened."
          );
      }

      setAppointment({
          doctor_id: "",
          date: "",
          time: "",
          notes: "",
      });
      setBookedSlots([]);
      setErrors({});
      setError("");
      doctorRef.current?.focus();

    } 
    catch (err) {
        console.error(err);

        if (!err.response) {
            setError("Unable to connect to the server.");
        } else if (err.response.status === 400) {
            setError("Invalid appointment details.");
        } else if (err.response.status === 401) {
            setError("Session expired. Please login again.");
        } else if (err.response.status === 409) {
            setError("This appointment slot is already booked.");
        } else {
            setError("Unable to schedule appointment.");
        }
    }finally {
        setSavingAppointment(false);
    }

  };
  const handleEnterNext = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const form = e.target.form;

      if (!form) return; // safety

      const elements = Array.from(form.elements).filter(
        (el) =>
          el.tagName === "INPUT" ||
          el.tagName === "SELECT" ||
          el.tagName === "TEXTAREA"
      );

      const index = elements.indexOf(e.target);

      if (index === elements.length - 1) {
        if (!savingAppointment) {
                handleReAppointment();
            }
      } else {
        elements[index + 1].focus(); // 👉 next
      }
    }
  };
  useEffect(() => {
    codeRef.current?.focus();
  }, []);
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const selectToday = () => {
    setAppointment((prev) => ({
        ...prev,
        date: formatDate(new Date()),
        time: "",
    }));

    setBookedSlots([]);

    setErrors((prev) => ({
        ...prev,
        date: "",
        time: "",
    }));
  };

  const selectTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    setAppointment((prev) => ({
        ...prev,
        date: formatDate(tomorrow),
        time: "",
    }));

    setBookedSlots([]);

    setErrors((prev) => ({
        ...prev,
        date: "",
        time: "",
    }));
  };

  const today = formatDate(new Date());

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tomorrowDate = formatDate(tomorrow);
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-white to-green-200 p-6">

      
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow p-4 mb-6 flex items-center justify-between">

        {/* LEFT */}
        <button
          onClick={() => navigate("/compounder")}
          className="bg-white px-4 py-2 rounded-lg font-bold text-gray-800 shadow hover:bg-gray-100"
        >
        Back
        </button>

        {/* CENTER */}
        <div className="flex-1 flex justify-center">
          
          <input
            ref={codeRef}
            placeholder="Search ID / Name / Phone / Address..."
            className="input w-full max-w-xs bg-white"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                e.preventDefault();

                await handleSearch();

                // wait for UI render
                setTimeout(() => {
                  doctorRef.current?.focus();
                }, 100);
              }
            }}
          />

        </div>

        {/* RIGHT */}
        <button
          onClick={handleSearch}
          disabled={searching}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          {searching ? "Searching..." : "Search"}
        </button>

      </div>
{error && (
  <div className="mb-4 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700">
    {error}
  </div>
)}
{searchResults.length > 0 && (
  <div className="bg-white rounded-lg shadow mt-4 overflow-hidden">
    <table className="w-full">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3">Patient ID</th>
          <th className="p-3">Name</th>
          <th className="p-3">Phone</th>
          <th className="p-3">Address</th>
          <th className="p-3">Action</th>
        </tr>
      </thead>

      <tbody>
        {searchResults.map((p) => (
          <tr key={p.id} className="border-b">
            <td className="p-3">{p.patient_code}</td>
            <td className="p-3">{p.name}</td>
            <td className="p-3">{p.phone}</td>
            <td className="p-3">{p.address}</td>

            <td className="p-3">
              <button
                onClick={() => selectPatient(p)}
                className="bg-blue-600 text-white px-4 py-1 rounded"
              >
                Select
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
      <h1 className="text-2xl font-semibold text-blue-900 mb-4">
        Re-Appointment Form
      </h1>

      {/* 🔷 MAIN GLASS CARD */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl p-6">

        {/* 🔷 PATIENT PROFILE */}
        
        {patient && (
          <div className="bg-gradient-to-r from-blue-100/80 via-blue-50/80 to-blue-100/60 backdrop-blur-md border border-blue-200 rounded-2xl p-6 flex justify-between items-center mb-6 shadow-md">

            {/* LEFT SIDE */}
            <div className="flex items-center gap-5">

              {/* AVATAR */}
              <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center shadow-inner">
                <span className="text-3xl text-blue-700">👤</span>
              </div>

              {/* DETAILS */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                  {patient.name}

                  {/* BADGE */}
                  <span className="text-xs bg-blue-200 text-blue-800 px-3 py-1 rounded-full font-medium">
                    Patient ID: {patient.patient_code}
                  </span>
                </h2>

                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>📞 {patient.phone}</p>
                  <p>📧 {patient.email || "—"}</p>
                  <p>📍 {lastData?.address}</p>
                  <p><b>Doctor:</b> {history[0]?.doctor_name || "—"}</p>
                </div>
              </div>
            </div>

            

            {/* RIGHT SIDE INFO TILES */}
            <div className="grid grid-cols-2 gap-3">

              {/* DATE OF BIRTH */}
              <div className="bg-white px-4 py-3 rounded-xl shadow-sm flex items-center gap-3">
                <span className="text-blue-600 text-lg">📅</span>
                <div className="text-sm">
                  <p className="text-gray-500 text-xs">Date of Birth</p>
                  <p className="font-medium">{lastData?.dob}</p>
                </div>
              </div>

              {/* LAST APPOINTMENT */}
              <div className="bg-white px-4 py-3 rounded-xl shadow-sm flex items-center gap-3">
                <span className="text-purple-600 text-lg">📍</span>
                <div className="text-sm">
                  <p className="text-gray-500 text-xs">Last Appointment</p>
                  <p className="font-medium">{lastData?.last_appointment_date}</p>
                </div>
              </div>

              {/* BLOOD GROUP */}
              <div className="bg-white px-4 py-3 rounded-xl shadow-sm flex items-center gap-3">
                <span className="text-red-500 text-lg">🩸</span>
                <div className="text-sm">
                  <p className="text-gray-500 text-xs">Blood Group</p>
                  <p className="font-medium">{patient.blood_group}</p>
                </div>
              </div>

              {/* STATUS */}
              <div className="bg-white px-4 py-3 rounded-xl shadow-sm flex items-center gap-3">
                <span className="text-green-600 text-lg">🛡️</span>
                <div className="text-sm">
                  <p className="text-gray-500 text-xs">Status</p>
                  <p className="font-medium capitalize">{lastData?.last_status}</p>
                </div>
              </div>

            </div>


          </div>
        )}
        {/* 🔷 SCHEDULE SECTION */}
        {patient && (
          <form onSubmit={(e) => { e.preventDefault(); handleReAppointment(); }}>
            <div className="rounded-xl overflow-hidden border shadow-sm">

              {/* HEADER STRIP */}
              <div className="bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 font-medium text-blue-800">
                Schedule Re-Appointment
              </div>

              {/* FORM */}


              <div className="p-4 grid grid-cols-4 gap-4">
                {/* <select
                  ref={doctorRef}
                  disabled={loadingDoctors}
                  className="input bg-white"
                  onChange={(e) =>
                    setAppointment({ ...appointment, doctor_id: e.target.value })
                  }
                  onKeyDown={handleEnterNext}
                > */}
                <select
                    ref={doctorRef}
                    value={appointment.doctor_id}
                    className={`input bg-white ${
                        errors.doctor_id ? "border-red-500" : ""
                    }`}
                    onChange={(e) => {
                        setAppointment((prev) => ({
                            ...prev,
                            doctor_id: e.target.value,
                            time: "",
                        }));

                        setBookedSlots([]);

                        setErrors((prev) => ({
                            ...prev,
                            doctor_id: "",
                            time: "",
                        }));
                    }}
                >

                  <option>{loadingDoctors ? "Loading doctors..." : "Select Doctor"}</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name}
                    </option>
                  ))}
                </select>
                {/* <input
                  type="date"
                  className="input bg-white"
                  onChange={(e) =>
                    setAppointment({ ...appointment, date: e.target.value })
                  }
                  onKeyDown={handleEnterNext}
                /> */}
                {/* <input
                  type="date"
                  className="input bg-white"
                  value={appointment.date}
                  onKeyDown={handleEnterNext}
                  onChange={(e) =>
                    setAppointment({ ...appointment, date: e.target.value })
                  }
                  onKeyDown={handleEnterNext}
                /> */}

                <input
                    type="date"
                    value={appointment.date}
                    className={`input bg-white ${
                        errors.date ? "border-red-500" : ""
                    }`}
                    onChange={(e) => {
                        setAppointment((prev) => ({
                            ...prev,
                            date: e.target.value,
                            time: "",
                        }));

                        setBookedSlots([]);

                        setErrors((prev) => ({
                            ...prev,
                            date: "",
                            time: "",
                        }));
                    }}
                />

                <button
                  type="button"
                  onClick={selectToday}
                  onKeyDown={handleEnterNext}
                  className={`px-6 py-2 rounded border-2 font-bold
                    ${
                      appointment.date === today
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-black bg-white hover:bg-blue-100"
                    }`}
                >
                  TODAY
                </button>
                <button
                  type="button"
                  onClick={selectTomorrow}
                  onKeyDown={handleEnterNext}
                  className={`px-6 py-2 rounded border-2 font-bold
                    ${
                      appointment.date === tomorrowDate
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-black bg-white hover:bg-blue-100"
                    }`}
                >
                  TOMORROW
                </button>               
                
              </div>
              {errors.doctor_id && (
                  <p className="text-red-500 text-sm mt-1">
                      {errors.doctor_id}
                  </p>
              )}

              {loadingSlots && (
                  <p className="text-blue-600 font-medium mb-3">
                      Loading available slots...
                  </p>
              )}
              {errors.date && (
                  <p className="text-red-500 text-sm mt-1">
                      {errors.date}
                  </p>
              )}
              <div className="grid grid-cols-6 gap-3 mt-4">
                {slots.map((slot) => {
                  const isBooked = bookedSlots.includes(slot);
                  const isSelected = appointment.time === slot;

                  return (
                    <div
                      key={slot}
                      // onClick={() => !isBooked && setAppointment({ ...appointment, time: slot })}

                      onClick={() => {
                          if (isBooked) return;

                          setAppointment({
                              ...appointment,
                              time: slot,
                          });

                          if (errors.time) {
                              setErrors((prev) => ({
                                  ...prev,
                                  time: "",
                              }));
                          }
                      }}

                      // className={`p-3 rounded-lg text-center cursor-pointer shadow
                      //   ${isBooked ? "bg-red-400 text-white cursor-not-allowed" : "bg-green-400 text-white hover:scale-105"}
                      // `}

                      className={`p-3 rounded-lg text-center cursor-pointer shadow
                        ${isBooked ? "bg-red-400 text-white cursor-not-allowed"
                        : isSelected ? "bg-blue-600 text-white scale-105"
                        : "bg-green-400 text-white hover:scale-105"}
                      `}

                    >
                      {slot}
                    </div>
                  );
                })}
              </div>
              {errors.time && (
                  <p className="text-red-500 text-sm mt-3">
                      {errors.time}
                  </p>
              )}

              <div className="p-4">
                <textarea
                  placeholder="Notes"
                  className="input w-full bg-white"
                  onChange={(e) =>
                    setAppointment({ ...appointment, notes: e.target.value })
                  }
                  onKeyDown={handleEnterNext}
                />
              </div>

              {/* 🔥 FOOTER BAR */}
              <div className="bg-gradient-to-r from-blue-200 to-blue-400 p-4 flex justify-end">
                {/* <button
                
                  type="submit"
                  className="bg-blue-700 text-white px-8 py-2 rounded-lg shadow hover:bg-blue-800"
                >
                  Schedule Appointment
                </button> */}

                <button
                    type="submit"
                    disabled={savingAppointment}
                    className="bg-blue-700 text-white px-8 py-2 rounded-lg shadow hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {savingAppointment
                        ? "Scheduling..."
                        : "Schedule Appointment"}
                </button>

              </div>

            </div>
          </form>
        )}

      </div>
    </div>
  );


}

export default ReAppointment;