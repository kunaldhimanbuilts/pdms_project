import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

function RegisterPatient() {
  const navigate = useNavigate(); 
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    title: "",
    name: "",
    dob: "",
    age: "",
    gender: "",
    blood_group: "",
    marital_status: "",
    phone: "",
    email: "",
    address: "",
    emergency_contact: "",
    emergency_person: "",
    doctor_id: "",
    date: "",
    time: "",
    notes: ""
  });

  const [slots, setSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
    
  useEffect(() => {
    if (form.doctor_id && form.date) {
      fetchSlots(form.doctor_id, form.date);
    }
  }, [form.doctor_id, form.date]);
  useEffect(() => {
    setSlots(generateSlots());
  }, []);

  const fetchSlots = async (doctorId, date) => {
    const res = await api.get(`/appointments/by-date?doctor_id=${doctorId}&date=${date}`);

    const formatted = res.data.map(t => t.slice(0, 5));
    setBookedSlots(formatted);
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
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    const fetchDoctors = async () => {
      const res = await api.get("/users/doctors");
      setDoctors(res.data);
    };
    fetchDoctors();
  }, []);
  const handleSubmit = async () => {
    try {
      const patientData = {
        ...form,
        name: `${form.title} ${form.name}`.trim(),
      };
      
      const patientRes = await api.post("/patients/", form);
      const patientId = patientRes.data.id;

      await api.post("/appointments/", {
        patient_id: patientId,
        doctor_id: form.doctor_id,
        date: form.date,
        time: form.time,
        notes: form.notes
      });

      // 🔥 WhatsApp Message
      const message = `
  Hello ${form.name},

  Your registration is successful ✅

  Doctor: ${doctors.find(d => d.id == form.doctor_id)?.name}
  Date: ${form.date}
  Time: ${form.time}

  Thank you!
      `;

      const phone = form.phone.replace(/\D/g, ""); // clean number
      const url = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;

      window.open(url, "_blank");

    } catch (err) {
      alert("Error occurred ❌");
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return "";

    const birth = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();

    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() &&
        today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const ageToDOB = (age) => {
    if (!age) return "";

    const today = new Date();

    const dob = new Date(
      today.getFullYear() - Number(age),
      today.getMonth(),
      today.getDate()
    );

    return dob.toISOString().split("T")[0];
  };

  const handleEnterNext = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const form = e.target.form;
      const elements = Array.from(form.elements).filter(
        (el) =>
          el.tagName === "INPUT" ||
          el.tagName === "SELECT" ||
          el.tagName === "TEXTAREA"
      );

      const index = elements.indexOf(e.target);

      if (index === elements.length - 1) {
        handleSubmit(); // 🔥 last → submit
      } else {
        elements[index + 1].focus(); // 👉 next field
      }
    }
  };
  useEffect(() => {
    const first = document.querySelector("input");
    first?.focus();
  }, []);
  
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const selectToday = () => {
    setForm(prev => ({
      ...prev,
      date: formatDate(new Date()),
    }));
  };

  const selectTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    setForm(prev => ({
      ...prev,
      date: formatDate(tomorrow),
    }));
  };

  const today = formatDate(new Date());

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tomorrowDate = formatDate(tomorrow);
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-green-100 p-6">

      {/* 🔙 BACK */}
      <button
        onClick={() => navigate("/compounder")}
        className="mb-4 bg-white px-4 py-2 rounded-lg font-bold text-grey-800 shadow hover:bg-gray-100 "
      >
       Back
      </button>

      <h1 className="text-2xl font-semibold text-blue-800 mb-6">
        New Patient Registration
      </h1>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>

        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">

          {/* 🔷 PERSONAL INFO */}
          
          <div className="border rounded-xl overflow-hidden">
            <div className="bg-blue-100 px-4 py-2 font-medium text-blue-800">
              Personal Information
            </div>

            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* <input name="name" placeholder="Full Name" className="input" onChange={handleChange} onKeyDown={handleEnterNext} /> */}

              <div className="flex gap-2 ">
                <select
                  name="title"
                  className="input "
                  value={form.title}
                  onChange={handleChange}
                  onKeyDown={handleEnterNext}
                >
                  <option value="">Title</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Miss">Miss</option>
                  <option value="Master">Master</option>
                  <option value="Baby">Baby</option>
                  <option value="Prof.">Prof.</option>
                  <option value="Dr.">Dr.</option>
                </select>

                <input
                  name="name"
                  className="input"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  onKeyDown={handleEnterNext}
                />
              </div>

              {/* <input type="date" name="dob" className="input" onChange={handleChange} onKeyDown={handleEnterNext}/>
              <div className="input flex items-center">
                Age: {calculateAge(form.dob)} Years
              </div> */}

              <input
                type="date"
                value={form.dob}
                onKeyDown={handleEnterNext}
                className="input flex items-center"
                onChange={(e) => {
                  const dob = e.target.value;

                  setForm(prev => ({
                    ...prev,
                    dob,
                    age: calculateAge(dob),
                  }));
                }}
              />

              <input
                type="number"
                placeholder="AGE"
                onKeyDown={handleEnterNext}
                className="input flex items-center"
                min="0"
                max="120"
                value={form.age}
                onChange={(e) => {
                  const age = e.target.value;

                  setForm(prev => ({
                    ...prev,
                    age,
                    dob: ageToDOB(age),
                  }));
                }}
              />

              <select name="gender" className="input" onChange={handleChange} onKeyDown={handleEnterNext}>
                <option>Select Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>

              <select name="blood_group" className="input" onChange={handleChange} onKeyDown={handleEnterNext}>
                <option>Select Blood Group</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>O+</option>
                <option>O-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>

              <select name="marital_status" className="input" onChange={handleChange} onKeyDown={handleEnterNext}>
                <option>Select Marital Status</option>
                <option>Married</option>
                <option>Unmarried</option>


              </select>
            </div>
          </div>


          {/* 🔷 CONTACT */}
          <div className="border rounded-xl overflow-hidden">
            <div className="bg-blue-100 px-4 py-2 font-medium text-blue-800">
              Contact Information
            </div>

            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              <input name="phone" placeholder="Contact Number" className="input" onChange={handleChange} onKeyDown={handleEnterNext}/>
              
              <input name="emergency_person" placeholder="Father/Husband Name" className="input" onChange={handleChange} onKeyDown={handleEnterNext}/>
              <input name="address" placeholder="Address" className="input col-span-2 md:col-span-3" onChange={handleChange} onKeyDown={handleEnterNext}/>
            </div>

            <div className="p-4 grid grid-cols-2 gap-4">
              <input name="emergency_contact" placeholder="Alternative Number" className="input" onChange={handleChange} onKeyDown={handleEnterNext}/>
              <input name="email" placeholder="Email Address" className="input" onChange={handleChange} onKeyDown={handleEnterNext}/>
            </div>
          </div>

          {/* 🔷 APPOINTMENT */}
          <div className="border rounded-xl overflow-hidden">
            <div className="bg-blue-100 px-4 py-2 font-medium text-blue-800">
              Schedule Appointment
            </div>

            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* <input name="doctor_id" placeholder="Doctor" className="input" onChange={handleChange} /> */}

              <select name="doctor_id" className="input" onChange={handleChange} onKeyDown={handleEnterNext}>
                <option>Select Doctor</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>

              {/* <input type="date" name="date" className="input" onChange={handleChange} /> */}
              {/* <input type="time" name="time" className="input" onChange={handleChange} /> */}
              <input
                  type="date"
                  name="date"
                  className="input flex-1"
                  value={form.date}
                  onChange={handleChange}
                  onKeyDown={handleEnterNext}
                />

                <button
                  type="button"
                  onClick={selectToday}
                  onKeyDown={handleEnterNext}
                  className={`px-6 py-2 rounded border-2 font-bold
                  ${
                      form.date === today
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
                      form.date === tomorrowDate
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-black bg-white hover:bg-blue-100"
                  }`}
                >
                  TOMORROW
                </button>


              
            </div>
            <div className="grid grid-cols-6 gap-3 mt-4">
              {slots.map((slot) => {
                const isBooked = bookedSlots.includes(slot);
                const isSelected = form.time === slot;

                return (
                  <div
                    key={slot}
                    onClick={() => !isBooked && setForm({ ...form, time: slot })}
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
            <div className="p-4">
              <textarea name="notes" placeholder="Notes" className="input w-full" onChange={handleChange} />
            </div>
          </div>

          {/* 🔥 BUTTON RIGHT SIDE */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Register Patient
            </button>
          </div>

        </div>
      </form>
    </div>
  );

}

export default RegisterPatient;