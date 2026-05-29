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
    const res = await api.get(`/appointments/by-date?doctor_id=${doctorId}&date=${date}`);

    const formatted = res.data.map(t => t.slice(0, 5)); // IMPORTANT
    setBookedSlots(formatted);
  };  
  useEffect(() => {
    if (selectedAppointment && newDate) {
      fetchSlots(selectedAppointment.doctor_id, newDate);
    }
  }, [selectedAppointment, newDate]);    


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/appointments/tomorrow");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 📲 WhatsApp Reminder
  const handleReminder = (phone, name, time) => {
    const msg = `Hello ${name}, reminder for your appointment tomorrow at ${time}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
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

  const submitReschedule = async () => {
    if (!selectedAppointment) return;

    if (!newDate || !newTime) {
      alert("Fill all fields");
      return;
    }

    const formattedTime = newTime.length === 5 ? `${newTime}:00` : newTime;

    try {
      await api.put(`/appointments/${selectedAppointment.id}`, {
        patient_id: selectedAppointment.patient_id,
        doctor_id: selectedAppointment.doctor_id,
        date: newDate,
        time: formattedTime,
        notes: selectedAppointment.notes || ""
      });

      const phone = selectedAppointment.patient_phone.startsWith("91")
        ? selectedAppointment.patient_phone
        : `91${selectedAppointment.patient_phone}`;

      const msg = `Hello ${selectedAppointment.patient_name}, your appointment has been rescheduled to ${newDate} at ${formattedTime}`;
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank");

      alert("Rescheduled & Notified ✅");

      setShowModal(false);
      setNewDate("");
      setNewTime("");
      fetchData();

    } catch (err) {
      console.log(err.response?.data); // 👈 check now
      alert("Error ❌");
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
            {data.map((a) => (
              <tr key={a.id} className="border-b">
                {/* <td className="p-2">{a.patient_id}</td>
                <td className="p-2">{a.doctor_id}</td>
                <td className="p-2">{a.time}</td> */}
                <td className="p-2">{a.patient_code}</td>
                <td className="p-2">{a.patient_name}</td>
                <td className="p-2">{a.patient_phone}</td>
                {/* <td className="p-2">{a.doctor_id}</td> */}
                <td className="p-2">{a.doctor_name}</td>
                <td className="p-2">{a.time}</td>


                <td className="p-2 flex gap-2">
                  <button
                    // onClick={() => handleReminder("91XXXXXXXXXX", "Patient", a.time)}
                    onClick={() => handleReminder(a.patient_phone, a.patient_name, a.time)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Remind
                  </button>

                  <button
                    // onClick={() => handleReschedule(a.id)}
                    onClick={() => {
                      setSelectedAppointment(a);
                      setShowModal(true);
                    }}

                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Reschedule
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>


        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4 text-blue-800">
                Reschedule Appointment
              </h2>

              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full mb-3 p-2 border rounded"
              />

              {/* <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
              /> */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {slots.map((slot) => {
                  const isBooked = bookedSlots.includes(slot);
                  const isSelected = newTime === slot;

                  return (
                    <div
                      key={slot}
                      onClick={() => !isBooked && setNewTime(slot)}
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
              <div className="flex justify-end gap-2">
                <button
                  // onClick={() => setShowModal(false)}

                  onClick={() => {
                    setShowModal(false);
                    setNewDate("");
                    setNewTime("");
                  }}

                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={submitReschedule}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
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