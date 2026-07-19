import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";


function FollowUp() {
  const navigate = useNavigate(); 
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
  const [followups, setFollowups] = useState([]);



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
    fetchFollowups();
  }, []);

  const openWhatsApp = (patient_phone, message) => {
      const url = `https://wa.me/${patient_phone}?text=${encodeURIComponent(message)}`;

      const popup = window.open(url, "_blank");

      return popup && !popup.closed && typeof popup.closed !== "undefined";
  };

  const formatPhoneNumber = (patient_phone) => {
    if (!patient_phone) return null;

    // Remove spaces, +, -, ()
    const cleaned = String(patient_phone).replace(/\D/g, "");

    if (!cleaned) return null;

    return cleaned.startsWith("91")
      ? cleaned
      : `91${cleaned}`;
  };
  const fetchFollowups = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/followups");

      setFollowups(res.data);
    } catch (err) {
      console.error("Follow-up records:", err);

      setFollowups([]);

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
            setError("Follow-up records not found.");
            break;

          case 500:
            setError("Server error. Please try again later.");
            break;

          default:
            setError("Failed to load Follow-up records.");
        }
      } else {
        setError("Network error. Please check your internet connection.");
      }
    } finally {
      setLoading(false);
    }
  };



  const handleReminder = (patient_phone, patient_name, next_visit_date) => {

    const formattedPhone = formatPhoneNumber(patient_phone);

    if (!formattedPhone) {
        alert("Patient phone number is unavailable.");
        return;
    }
const msg = `
Dear ${patient_name},

Greetings from *S&D Eye Care Centre*.

This is a gentle reminder that your *Follow-Up Visit* is due.

━━━━━━━━━━━━━━━━━━
📅 *Follow-Up Date:* ${next_visit_date}
━━━━━━━━━━━━━━━━━━

To avoid waiting, please *book your appointment slot* before visiting the clinic.

📞 Call/WhatsApp: +91 8077799516

Please arrive *10 minutes before* your scheduled appointment.

Kindly bring:
• Previous prescription
• Medical reports (if any)
• Current spectacles/contact lenses

If you are unable to visit on the scheduled date, please contact us in advance so we can help you reschedule your appointment.

Thank you for choosing *S&D Eye Care Centre*.

━━━━━━━━━━━━━━━━━━

प्रिय ${patient_name},

*एस एंड डी आई केयर सेंटर* की ओर से नमस्कार।

यह आपके *फॉलो-अप विज़िट* की विनम्र याद दिलाने हेतु संदेश है।

━━━━━━━━━━━━━━━━━━
📅 *फॉलो-अप तिथि:* ${next_visit_date}
━━━━━━━━━━━━━━━━━━

कृपया क्लिनिक आने से पहले अपना *अपॉइंटमेंट स्लॉट बुक कर लें*, ताकि आपको प्रतीक्षा न करनी पड़े।

📞 कॉल/व्हाट्सएप: +91 8077799516

कृपया निर्धारित समय से *10 मिनट पहले* क्लिनिक पहुँचें।

साथ में अवश्य लाएँ:
• पिछला प्रिस्क्रिप्शन
• मेडिकल रिपोर्ट (यदि हो)
• वर्तमान चश्मा / कॉन्टैक्ट लेंस

यदि आप निर्धारित तिथि पर नहीं आ सकते हैं, तो कृपया पहले से संपर्क करें ताकि आपका नया अपॉइंटमेंट निर्धारित किया जा सके।

*एस एंड डी आई केयर सेंटर* पर विश्वास करने के लिए धन्यवाद।

हम आपकी सेवा के लिए सदैव तत्पर हैं।
`;
    const success = openWhatsApp(formattedPhone, msg);

    if (!success) {
        alert(
            "Unable to open WhatsApp. Please allow pop-ups in your browser."
        );
    }

  };


  const submitReschedule = async () => {
    if (!selectedAppointment) return;

    if (saving) return;
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

      await api.post("/appointments/", {
        patient_id: selectedAppointment.patient_id,
        doctor_id: selectedAppointment.doctor_id,
        date: newDate,
        time: formattedTime,
        notes: "Follow-up Appointment",
      });

      const patient_phone = formatPhoneNumber(
          selectedAppointment.patient_phone
      );

      if (!patient_phone) {
          alert("Appointment rescheduled successfully, but patient phone number is unavailable.");

          setShowModal(false);
          setNewDate("");
          setNewTime("");
          setErrors({});
          setSlotsError("");
          setBookedSlots([]);
          setModalError("");
          fetchFollowups();

          return;
      }

const msg = `
Dear ${selectedAppointment.patient_name},

Greetings from *S&D Eye Care Centre*.

Your appointment has been successfully Scheduled.

━━━━━━━━━━━━━━━━━━
📅 *New Appointment Date:* ${newDate}
🕒 *New Appointment Time:* ${formattedTime}
━━━━━━━━━━━━━━━━━━

Kindly arrive *10 minutes before* your scheduled appointment.

Please carry:
• Previous prescription
• Medical reports (if any)
• Current spectacles/contact lenses

If this new schedule is inconvenient, please contact us for further assistance.

Thank you for choosing *S&D Eye Care Centre*.

📍 S&D Eye Care Centre
📞 +91 8077799516

We appreciate your cooperation.
`;
      
      const success = openWhatsApp(patient_phone, msg);

      if (!success) {
          alert(
              "Unable to open WhatsApp. Please allow pop-ups in your browser."
          );
      }

      alert("Appointment rescheduled successfully.");

      setShowModal(false);

      setNewDate("");
      setNewTime("");

      setErrors({});
      setSlotsError("");
      setBookedSlots([]);
      setModalError("");

      fetchFollowups();
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
  return (
    <div>
      <button
        onClick={() => navigate("/compounder")}
        className="mb-4 bg-white px-4 py-2 rounded-lg font-bold text-grey-800 shadow hover:bg-gray-100 "
      >
       Back
      </button>
      <h1 className="text-2xl font-bold text-blue-800 mb-6">
        Follow-Up Patients
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
              <th className="p-2">Patient ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Doctor</th>
              {/* <th className="p-2">Next Visit</th> */}
              <th className="p-2">Last Visit</th>
              <th className="p-2">Reason</th>


              <th className="p-2">Actions</th>
            </tr>
          </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-500">
                    Loading Follow-up records...
                  </td>
                </tr>
              ) : followups.length > 0 ? (
                followups.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">{item.patient_code}</td>
                    <td className="p-2">{item.patient_name}</td>
                    <td className="p-2">{item.patient_phone}</td>
                    <td className="p-2">{item.doctor_name}</td>
                    {/* <td className="p-2">{item.next_visit_date}</td> */}
                    <td className="p-2">{item.created_at?.split("T")[0]}</td>
                    <td className="p-2">{item.next_visit_reason}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() =>
                          handleReminder(item.patient_phone, item.patient_name, item.next_visit_date)
                        }
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Remind
                      </button>

                      <button
                        disabled={saving || item.scheduled}
                        onClick={() => {
                          setSelectedAppointment(item);

                          setModalError("");
                          setErrors({});
                          setSlotsError("");
                          setBookedSlots([]);

                          setNewDate("");
                          setNewTime("");

                          setShowModal(true);
                        }}
                        className={`px-3 py-1 rounded text-white ${
                          saving || item.scheduled
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-yellow-500 hover:bg-yellow-600"
                        }`}
                      >
                        {item.scheduled ? "Scheduled" : "Schedule"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-500">
                    No Follow-up records for tomorrow.
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

export default FollowUp;