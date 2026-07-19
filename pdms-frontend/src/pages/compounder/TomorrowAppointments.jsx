import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";


function TomorrowAppointments() {
  const navigate = useNavigate(); 
  const [data, setData] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [slots, setSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [error, setError] = useState("");
  const [slotsError, setSlotsError] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [modalError, setModalError] = useState("");


  const generateSlots = () => {
    const slots = [];
    let start = 9 * 60;
    let end = 19 * 60;

    for (let t = start; t < end; t += 20) {
      const hours = Math.floor(t / 60);
      const minutes = t % 60;

      const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
      slots.push(time);
    }

    return slots;
  };
  useEffect(() => {
    setSlots(generateSlots());
  }, []);



  // const fetchSlots = async (doctorId, date) => {
  //   const res = await api.get(`/appointments/by-date?doctor_id=${doctorId}&date=${date}`);

  //   const formatted = res.data.map(t => t.slice(0, 5)); // IMPORTANT
  //   setBookedSlots(formatted);
  // };  

  const fetchSlots = async (doctorId, date) => {
    try {
      setSlotsLoading(true);
      setSlotsError("");

      const res = await api.get(
        `/appointments/by-date?doctor_id=${doctorId}&date=${date}`
      );

      const formatted = res.data.map((t) => t.slice(0, 5));

      setBookedSlots(formatted);
    } catch (err) {
      console.error("Slots:", err);

      setBookedSlots([]);

      if (err.response) {
        switch (err.response.status) {
          case 400:
            setSlotsError("Invalid date selected.");
            break;

          case 401:
            setSlotsError("Please login again.");
            break;

          case 403:
            setSlotsError("Access denied.");
            break;

          case 404:
            setSlotsError("No slots found.");
            break;

          case 500:
            setSlotsError("Server error.");
            break;

          default:
            setSlotsError("Unable to load slots.");
        }
      } else {
        setSlotsError("Network error.");
      }
    } finally {
      setSlotsLoading(false);
    }
  };




  useEffect(() => {
    if (selectedAppointment && newDate) {
      fetchSlots(selectedAppointment.doctor_id, newDate);
    }
  }, [selectedAppointment, newDate]);    


  useEffect(() => {
    fetchData();
  }, []);

  // const fetchData = async () => {
  //   try {
  //     const res = await api.get("/appointments/tomorrow");
  //     setData(res.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  const openWhatsApp = (phone, message) => {
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

      const popup = window.open(url, "_blank");

      return popup && !popup.closed && typeof popup.closed !== "undefined";
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return null;

    // Remove spaces, +, -, ()
    const cleaned = String(phone).replace(/\D/g, "");

    if (!cleaned) return null;

    return cleaned.startsWith("91")
      ? cleaned
      : `91${cleaned}`;
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/appointments/tomorrow");

      setData(res.data);
    } catch (err) {
      console.error("Tomorrow appointments:", err);

      setData([]);

      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError("Invalid request.");
            break;

          case 401:
            setError("Your session has expired. Please login again.");
            break;

          case 403:
            setError("You don't have permission to access this page.");
            break;

          case 404:
            setError("Tomorrow appointments not found.");
            break;

          case 500:
            setError("Server error. Please try again later.");
            break;

          default:
            setError("Failed to load tomorrow appointments.");
        }
      } else {
        setError("Network error. Please check your internet connection.");
      }
    } finally {
      setLoading(false);
    }
  };


  // 📲 WhatsApp Reminder
  // const handleReminder = (phone, name, time) => {
  //   const msg = `Hello ${name}, reminder for your appointment tomorrow at ${time}`;
  //   const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  //   window.open(url, "_blank");
  // };
  const handleReminder = (phone, name, patientCode, time) => {
    // const formattedPhone = phone.startsWith("91")
    //   ? phone
    //   : `91${phone}`;
    const formattedPhone = formatPhoneNumber(phone);

    if (!formattedPhone) {
        alert("Patient phone number is unavailable.");
        return;
    }
const msg = `
Dear ${name},

Greetings from *S&D Eye Care Centre*.

This is a friendly reminder that your *appointment is scheduled for tomorrow.*

━━━━━━━━━━━━━━━━━━
🆔 *Patient ID:* ${patientCode}
🕒 *Appointment Time:* ${time}
━━━━━━━━━━━━━━━━━━

Please arrive *10 minutes before* your appointment.

Kindly bring:
• Previous prescription
• Medical reports (if any)
• Current spectacles/contact lenses

If you are unable to attend, please let us know in advance so we can assist you with rescheduling your appointment.

Thank you for choosing *S&D Eye Care Centre*.

📍 S&D Eye Care Centre
📞 +91 8077799516

We look forward to welcoming you.

━━━━━━━━━━━━━━━━━━

प्रिय ${name} जी,

*एस एंड डी आई केयर सेंटर* की ओर से नमस्कार।

यह आपको याद दिलाने के लिए संदेश है कि *आपका अपॉइंटमेंट कल निर्धारित है।*

━━━━━━━━━━━━━━━━━━
🕒 *अपॉइंटमेंट का समय:* ${time}
━━━━━━━━━━━━━━━━━━

कृपया अपने अपॉइंटमेंट के समय से *10 मिनट पहले* क्लिनिक पहुँचें।

कृपया अपने साथ लाएँ:
• पुराना पर्चा (यदि हो)
• मेडिकल रिपोर्ट (यदि हो)
• अपना वर्तमान चश्मा या कॉन्टैक्ट लेंस

यदि आप किसी कारणवश नहीं आ सकते हैं, तो कृपया पहले से हमें सूचित करें ताकि आपके लिए नया अपॉइंटमेंट तय किया जा सके।

*एस एंड डी आई केयर सेंटर* पर विश्वास करने के लिए आपका धन्यवाद।

📍 एस एंड डी आई केयर सेंटर
📞 +91 8077799516

हम आपके स्वागत के लिए तत्पर हैं।
`;
    const success = openWhatsApp(formattedPhone, msg);

    if (!success) {
        alert(
            "Unable to open WhatsApp. Please allow pop-ups in your browser."
        );
    }

    // if (!popup || popup.closed || typeof popup.closed === "undefined") {
    //   alert(
    //     "Unable to open WhatsApp. Please allow pop-ups in your browser and try again."
    //   );
    // }
  };

  // const submitReschedule = async () => {
  //   if (!selectedAppointment) return;
  //   if (!newDate || !newTime) {
  //     alert("Fill all fields");
  //     return;
  //   }

  //   try {
  //     await api.put(`/appointments/${selectedAppointment.id}`, {
  //       date: newDate,
  //       time: newTime
  //     });

  //     // ✅ WhatsApp update after reschedule
  //     const msg = `Hello ${selectedAppointment.patient_name}, your appointment has been rescheduled to ${newDate} at ${newTime}`;
  //     const url = `https://wa.me/${selectedAppointment.patient_phone}?text=${encodeURIComponent(msg)}`;
  //     window.open(url, "_blank");

  //     alert("Rescheduled & Notified ✅");

  //     setShowModal(false);
  //     setNewDate("");
  //     setNewTime("");
  //     fetchData();

  //   } catch {
  //     alert("Error ❌");
  //   }
  // };

  // const submitReschedule = async () => {
  //   if (!selectedAppointment) return;

  //   if (!newDate || !newTime) {
  //     alert("Fill all fields");
  //     return;
  //   }

  //   const formattedTime = newTime.length === 5 ? `${newTime}:00` : newTime;

  //   try {
  //     await api.put(`/appointments/${selectedAppointment.id}`, {
  //       patient_id: selectedAppointment.patient_id,
  //       doctor_id: selectedAppointment.doctor_id,
  //       date: newDate,
  //       time: formattedTime,
  //       notes: selectedAppointment.notes || ""
  //     });

  //     const phone = selectedAppointment.patient_phone.startsWith("91")
  //       ? selectedAppointment.patient_phone
  //       : `91${selectedAppointment.patient_phone}`;

  //     const msg = `Hello ${selectedAppointment.patient_name}, your appointment has been rescheduled to ${newDate} at ${formattedTime}`;
  //     const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  //     window.open(url, "_blank");

  //     alert("Rescheduled & Notified ✅");

  //     setShowModal(false);
  //     setNewDate("");
  //     setNewTime("");
  //     fetchData();

  //   } catch (err) {
  //     console.log(err.response?.data); // 👈 check now
  //     alert("Error ❌");
  //   }
  // };

  const submitReschedule = async () => {
    if (!selectedAppointment) return;

    if (saving) return;

    // if (!newDate || !newTime) {
    //   alert("Please select both date and time.");
    //   return;
    // }
    const validationErrors = {};

    if (!newDate) {
      validationErrors.newDate = "Please select a date.";
    }

    if (!newTime) {
      validationErrors.newTime = "Please select a time slot.";
    }

    const today = new Date().toISOString().split("T")[0];

    if (newDate && newDate < today) {
      validationErrors.newDate = "Past dates are not allowed.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const formattedTime =
      newTime.length === 5 ? `${newTime}:00` : newTime;

    try {
      
      const confirmed = window.confirm(
        `Reschedule appointment to ${newDate} at ${formattedTime}?`
      );

      if (!confirmed) return;
      
      setModalError("");

      setSaving(true);

      await api.put(`/appointments/${selectedAppointment.id}`, {
        patient_id: selectedAppointment.patient_id,
        doctor_id: selectedAppointment.doctor_id,
        date: newDate,
        time: formattedTime,
        notes: selectedAppointment.notes || "",
      });

      // const phone = selectedAppointment.patient_phone.startsWith("91")
      //   ? selectedAppointment.patient_phone
      //   : `91${selectedAppointment.patient_phone}`;
      const phone = formatPhoneNumber(
          selectedAppointment.patient_phone
      );

      if (!phone) {
          alert("Appointment rescheduled successfully, but patient phone number is unavailable.");

          setShowModal(false);
          setNewDate("");
          setNewTime("");
          setErrors({});
          setSlotsError("");
          setBookedSlots([]);
          setModalError("");
          fetchData();

          return;
      }
      // const msg = `Hello ${selectedAppointment.patient_name}, your appointment has been rescheduled to ${newDate} at ${formattedTime}`;
const msg = `
Dear ${selectedAppointment.patient_name} Ji,

Greetings from *S&D Eye Care Centre*.

Your *appointment has been successfully rescheduled.*

━━━━━━━━━━━━━━━━━━
🆔 *Patient ID:* ${selectedAppointment.patient_code}
📅 *New Appointment Date:* ${newDate}
🕒 *New Appointment Time:* ${formattedTime}
━━━━━━━━━━━━━━━━━━

Please arrive *10 minutes before* your appointment.

Kindly bring:
• Previous prescription
• Medical reports (if any)
• Current spectacles/contact lenses

If the new appointment date or time is not convenient for you, please contact us in advance so we can arrange another suitable appointment.

Thank you for choosing *S&D Eye Care Centre*.

📍 S&D Eye Care Centre
📞 +91 8077799516

We look forward to seeing you at your appointment.

━━━━━━━━━━━━━━━━━━

प्रिय ${selectedAppointment.patient_name} जी,

*एस एंड डी आई केयर सेंटर* की ओर से नमस्कार।

आपका *अपॉइंटमेंट सफलतापूर्वक पुनर्निर्धारित (Reschedule) कर दिया गया है।*

━━━━━━━━━━━━━━━━━━
📅 *नई अपॉइंटमेंट तारीख:* ${newDate}
🕒 *नया अपॉइंटमेंट समय:* ${formattedTime}
━━━━━━━━━━━━━━━━━━

कृपया अपने अपॉइंटमेंट के समय से *10 मिनट पहले* क्लिनिक पहुँचें।

कृपया अपने साथ लाएँ:
• पुराना पर्चा (यदि हो)
• मेडिकल रिपोर्ट (यदि हो)
• अपना वर्तमान चश्मा या कॉन्टैक्ट लेंस

यदि नई अपॉइंटमेंट की तारीख या समय आपके लिए सुविधाजनक नहीं है, तो कृपया पहले से हमें सूचित करें ताकि आपके लिए नया समय निर्धारित किया जा सके।

*एस एंड डी आई केयर सेंटर* पर विश्वास करने के लिए आपका धन्यवाद।

📍 एस एंड डी आई केयर सेंटर
📞 +91 8077799516

हम आपकी सेवा के लिए सदैव तत्पर हैं।
`;
      // const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
      const success = openWhatsApp(phone, msg);

      if (!success) {
          alert(
              "Unable to open WhatsApp. Please allow pop-ups in your browser."
          );
      }


      // window.open(url, "_blank");

      // const popup = window.open(url, "_blank");

      // if (!popup || popup.closed || typeof popup.closed === "undefined") {
      //   alert(
      //     "Appointment rescheduled successfully, but WhatsApp could not be opened."
      //   );
      // }


      alert("Appointment rescheduled successfully.");

      setShowModal(false);

      setNewDate("");
      setNewTime("");

      setErrors({});
      setSlotsError("");
      setBookedSlots([]);
      setModalError("");

      fetchData();
    } catch (err) {
      console.error("Reschedule:", err);

      if (err.response) {
        switch (err.response.status) {
            case 400:
                setModalError("This slot is already booked.");
                break;

            case 401:
                setModalError("Your session has expired. Please login again.");
                break;

            case 403:
                setModalError("You don't have permission to perform this action.");
                break;

            case 404:
                setModalError("Appointment not found.");
                break;

            case 500:
                setModalError("Server error. Please try again later.");
                break;

            default:
                setModalError("Failed to reschedule appointment.");
        }
      } else {
          setModalError(
              "Network error. Please check your internet connection."
          );
        }
    } finally {
      setSaving(false);
    }
  };


  // 🔁 Reschedule
  // const handleReschedule = async (id) => {
  //   const newDate = prompt("Enter new date (YYYY-MM-DD)");
  //   const newTime = prompt("Enter new time (HH:MM:SS)");

  //   if (!newDate || !newTime) return;

  //   try {
  //     await api.put(`/appointments/${id}`, {
  //       date: newDate,
  //       time: newTime
  //     });

  //     alert("Rescheduled ✅");
  //     fetchData();

  //   } catch {
  //     alert("Error ❌");
  //   }
  // };

  return (
    <div>
      <button
        onClick={() => navigate("/compounder")}
        className="mb-4 bg-white px-4 py-2 rounded-lg font-bold text-grey-800 shadow hover:bg-gray-100 "
      >
       Back
      </button>
      <h1 className="text-2xl font-bold text-blue-800 mb-6">
        Tomorrow Appointments
      </h1>
      {error && (
        <div className="mb-4 p-4 rounded-lg border border-red-300 bg-red-100 text-red-700">
          {error}
        </div>
      )}
      <div className="bg-white p-6 rounded-xl shadow">
        <table className="w-full text-left">

          <thead>
            <tr className="border-b">
              {/* <th className="p-2">Patient ID</th>
              <th className="p-2">Doctor</th>
              <th className="p-2">Time</th> */}
              <th className="p-2">Patient ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Doctor</th>
              <th className="p-2">Time</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-500">
                    Loading tomorrow's appointments...
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((a) => (
                  <tr key={a.id} className="border-b">
                    <td className="p-2">{a.patient_code}</td>
                    <td className="p-2">{a.patient_name}</td>
                    <td className="p-2">{a.patient_phone}</td>
                    <td className="p-2">{a.doctor_name}</td>
                    <td className="p-2">{a.time}</td>

                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() =>
                          handleReminder(a.patient_phone, a.patient_name,a.patient_code, a.time)
                        }
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Remind
                      </button>

                      <button
                        disabled={saving}
                        // onClick={() => {
                        //   setSelectedAppointment(a);
                        //   setShowModal(true);
                        // }}

                        onClick={() => {
                            setSelectedAppointment(a);

                            setModalError("");
                            setErrors({});
                            setSlotsError("");
                            setBookedSlots([]);

                            setNewDate("");
                            setNewTime("");

                            setShowModal(true);
                        }}

                        className={`px-3 py-1 rounded text-white ${
                          saving
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-yellow-500 hover:bg-yellow-600"
                        }`}
                      >
                        Reschedule
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-500">
                    No appointments scheduled for tomorrow.
                  </td>
                </tr>
              )}
            </tbody>

        </table>


        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4 text-blue-800">
                Reschedule Appointment
              </h2>
              {modalError && (
                <div className="mb-3 p-3 rounded-lg border border-red-300 bg-red-100 text-red-700">
                  {modalError}
                </div>
              )}
              {/* <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full mb-3 p-2 border rounded"
              /> */}
              <input
                type="date"
                disabled={slotsLoading || saving}
                value={newDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => {
                  setNewDate(e.target.value);
                  setModalError("");
                  // Clear previously selected slot
                  setNewTime("");

                  if (errors.newDate) {
                    setErrors((prev) => ({
                      ...prev,
                      newDate: "",
                      newTime: "",
                    }));
                  }

                  // Optional: clear old slot error
                  setSlotsError("");
                }}
                className={`w-full mb-1 p-2 border rounded ${
                  errors.newDate ? "border-red-500" : ""
                }`}
              />

              {errors.newDate && (
                <p className="text-red-500 text-sm mb-3">
                  {errors.newDate}
                </p>
              )}
              {/* <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
              /> */}

              {slotsError && (
                <div className="mb-3 p-3 rounded-lg bg-red-100 border border-red-300 text-red-700">
                  {slotsError}
                </div>
              )}
              {slotsLoading && (
                <p className="text-gray-500 text-sm mb-2">
                  Loading available slots...
                </p>
              )}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {slots.map((slot) => {
                  const isBooked = bookedSlots.includes(slot);
                  const isSelected = newTime === slot;

                  return (
                    <div
                      key={slot}
                      // onClick={() => !isBooked && setNewTime(slot)}

                      onClick={() => {
                        if (!isBooked) {
                            setNewTime(slot);

                            setModalError("");

                            if (errors.newTime) {
                                setErrors((prev) => ({
                                    ...prev,
                                    newTime: "",
                                }));
                            }
                        }
                      }}
                      className={`p-2 rounded text-center text-sm cursor-pointer
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

              {errors.newTime && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.newTime}
                </p>
              )}

              <div className="flex justify-end gap-2">
                {/* <button
                  // onClick={() => setShowModal(false)}

                  onClick={() => {
                    setShowModal(false);
                    setNewDate("");
                    setNewTime("");
                  }}

                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button> */}
                <button
                  disabled={saving}
                  onClick={() => {
                    if (saving) return;
                    setShowModal(false);
                    setSelectedAppointment(null);
                    

                    setNewDate("");
                    setNewTime("");

                    setErrors({});
                    setSlotsError("");
                    setModalError("");
                    setBookedSlots([]);

                  }}
                  className={`px-4 py-2 rounded ${
                    saving
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                >
                  Cancel
                </button>


                {/* <button
                  onClick={submitReschedule}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button> */}

                <button
                  onClick={submitReschedule}
                  disabled={saving || slotsLoading}
                  className={`px-4 py-2 rounded text-white ${
                      saving || slotsLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {saving ? "Saving..." : "Save"}
                </button>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default TomorrowAppointments;