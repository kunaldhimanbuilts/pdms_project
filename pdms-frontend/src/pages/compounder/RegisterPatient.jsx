import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useRef } from "react";
function RegisterPatient() {
  const navigate = useNavigate(); 
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);

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

  // const fetchSlots = async (doctorId, date) => {
  //   const res = await api.get(`/appointments/by-date?doctor_id=${doctorId}&date=${date}`);

  //   const formatted = res.data.map(t => t.slice(0, 5));
  //   setBookedSlots(formatted);
  // };
  const fetchSlots = async (doctorId, date) => {
    setLoadingSlots(true);
    setError("");

    try {
      const res = await api.get(
        `/appointments/by-date?doctor_id=${doctorId}&date=${date}`
      );

      const formatted = res.data.map((t) => t.slice(0, 5));
      setBookedSlots(formatted);
    } catch (err) {
      console.error(err);
      setBookedSlots([]);

      if (!err.response) {
        setError("Unable to connect to the server.");
      } else if (err.response.status === 400) {
        setError("Invalid appointment date.");
      } else if (err.response.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err.response.status === 403) {
        setError("You don't have permission to view slots.");
      } else if (err.response.status === 404) {
        setError("No slots available.");
      } else {
        setError("Unable to load appointment slots.");
      }
    } finally {
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
  // const handleChange = (e) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };


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
        setDoctors([]);

        if (!err.response) {
          setError("Unable to connect to the server.");
        } else if (err.response.status === 401) {
          setError("Session expired. Please login again.");
        } else if (err.response.status === 403) {
          setError("You don't have permission to view doctors.");
        } else {
          setError("Unable to load doctors.");
        }
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);


  // const handleSubmit = async () => {
  //   try {
  //     const patientData = {
  //       ...form,
  //       name: `${form.title} ${form.name}`.trim(),
  //     };
      
  //     const patientRes = await api.post("/patients/", form);
  //     const patientId = patientRes.data.id;

  //     await api.post("/appointments/", {
  //       patient_id: patientId,
  //       doctor_id: form.doctor_id,
  //       date: form.date,
  //       time: form.time,
  //       notes: form.notes
  //     });

  //     // 🔥 WhatsApp Message
  //     const message = `
  // Hello ${form.name},

  // Your registration is successful ✅

  // Doctor: ${doctors.find(d => d.id == form.doctor_id)?.name}
  // Date: ${form.date}
  // Time: ${form.time}

  // Thank you!
  //     `;

  //     const phone = form.phone.replace(/\D/g, ""); // clean number
  //     const url = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;

  //     window.open(url, "_blank");

  //   } catch (err) {
  //     alert("Error occurred ❌");
  //   }
  // };
const handleSubmit = async () => {

  const validationErrors = {};

  if (!form.name.trim()) {
    validationErrors.name = "Full name is required.";
  }
  if (form.phone && !/^\d{10}$/.test(form.phone)) {
    validationErrors.phone = "Phone number must contain exactly 10 digits.";
  }
  if (
    form.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)
  ) {
    validationErrors.email = "Invalid email address.";
  }

  if (!form.doctor_id) {
    validationErrors.doctor_id = "Please select a doctor.";
  }

  if (!form.date) {
    validationErrors.date = "Please select appointment date.";
  }

  if (!form.time) {
    validationErrors.time = "Please select a time slot.";
  }

  if (form.dob) {
    const dob = new Date(form.dob);
    const today = new Date();

    if (dob > today) {
      validationErrors.dob = "Future date of birth is not allowed.";
    }
  }

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setErrors({});

  if (saving) return;

  setSaving(true);
  setError("");

  try {
    const patientData = {
      ...form,
      name: `${form.title} ${form.name}`.trim(),
    };

    const patientRes = await api.post("/patients/", patientData);

    const patientId = patientRes.data.id;

    await api.post("/appointments/", {
      patient_id: patientId,
      doctor_id: form.doctor_id,
      date: form.date,
      time: form.time,
      notes: form.notes,
    });

    const doctorName = doctors.find(
      (d) => d.id == form.doctor_id
    )?.name;

const message = `
Dear ${form.name},

Greetings from *S&D Eye Care Centre*.

Thank you for registering with us.

Your *appointment has been successfully booked.*

━━━━━━━━━━━━━━━━━━
👨‍⚕️ *Consulting Doctor:* ${doctorName}
📅 *Appointment Date:* ${form.date}
🕒 *Appointment Time:* ${form.time}
━━━━━━━━━━━━━━━━━━

Please arrive *10 minutes before* your appointment.

Kindly bring:
• Previous prescriptions (if any)
• Medical reports (if any)
• Current spectacles/contact lenses (if applicable)

If you are unable to visit on the scheduled date and time, please let us know in advance so we can arrange another appointment for you.

Thank you for choosing *S&D Eye Care Centre*.

📍 S&D Eye Care Centre
📞 +91 8077799516

We look forward to welcoming you.

━━━━━━━━━━━━━━━━━━

प्रिय ${form.name} जी,

*एस एंड डी आई केयर सेंटर* की ओर से आपका हार्दिक स्वागत है।

हमारे यहाँ पंजीकरण कराने के लिए आपका धन्यवाद।

आपका *अपॉइंटमेंट सफलतापूर्वक बुक हो गया है।*

━━━━━━━━━━━━━━━━━━
👨‍⚕️ *डॉक्टर:* ${doctorName}
📅 *अपॉइंटमेंट की तारीख:* ${form.date}
🕒 *अपॉइंटमेंट का समय:* ${form.time}
━━━━━━━━━━━━━━━━━━

कृपया अपने अपॉइंटमेंट के समय से *10 मिनट पहले* क्लिनिक पहुँचें।

कृपया अपने साथ लाएँ:
• पुराना पर्चा (यदि हो)
• मेडिकल रिपोर्ट (यदि हो)
• अपना वर्तमान चश्मा या कॉन्टैक्ट लेंस (यदि उपयोग करते हों)

यदि आप तय समय पर नहीं आ सकते हैं, तो कृपया पहले से हमें सूचित करें ताकि आपके लिए नया अपॉइंटमेंट तय किया जा सके।

*एस एंड डी आई केयर सेंटर* पर विश्वास करने के लिए आपका धन्यवाद।

📍 एस एंड डी आई केयर सेंटर
📞 +91 8077799516

हम आपके स्वस्थ जीवन की कामना करते हैं और आपके स्वागत के लिए तत्पर हैं।
`;

    const phone = form.phone.replace(/\D/g, "");

    const url = `https://wa.me/91${phone}?text=${encodeURIComponent(
      message
    )}`;

    // window.open(url, "_blank");
    // const popup = window.open(url, "_blank");

    // if (form.phone) {
    //     const popup = window.open(url, "_blank");

    //     if (!popup || popup.closed) {
    //         alert("Patient registered successfully, but WhatsApp could not be opened.");
    //     }
    // }

    // alert("Patient registered successfully.");

    if (form.phone) {
        const popup = window.open(url, "_blank");

        if (!popup || popup.closed) {
            alert("Patient registered successfully, but WhatsApp could not be opened.");
        } else {
            alert("Patient registered successfully.");
        }
    } else {
        alert("Patient registered successfully, but WhatsApp could not be opened.");
    }

    
    setForm({
        
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
        notes: "",
    });
    nameRef.current?.focus();
    setBookedSlots([]);
    setErrors({});
    setError("");
  } catch (err) {
    console.error(err);

    if (!err.response) {
      setError("Unable to connect to the server.");
    } else {
      switch (err.response.status) {
        case 400:
          setError("Invalid patient or appointment details.");
          break;

        case 401:
          setError("Session expired. Please login again.");
          break;

        case 403:
          setError("You don't have permission to register patients.");
          break;

        case 404:
          setError("Required resource not found.");
          break;

        case 409:
          setError("This appointment slot is already booked.");
          break;

        case 422:
          setError("Please check the entered information.");
          break;

        case 500:
          setError("Server error. Please try again later.");
          break;

        default:
          setError("Failed to register patient.");
      }
    }
  } finally {
    setSaving(false);
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

      // if (index === elements.length - 1) {
      //   handleSubmit(); // 🔥 last → submit
      // }

      if (index === elements.length - 1) {
          if (!saving) {
              handleSubmit();
          }
      }      
       else {
        elements[index + 1].focus(); // 👉 next field
      }
    }
  };
  // useEffect(() => {
  //   const first = document.querySelector("input");
  //   first?.focus();
  // }, []);

  useEffect(() => {
      nameRef.current?.focus();
  }, []);

  
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // const selectToday = () => {
  //   setForm(prev => ({
  //     ...prev,
  //     date: formatDate(new Date()),
  //     time: "",
  //   }));
  // };
  const selectToday = () => {
    setForm((prev) => ({
      ...prev,
      date: formatDate(new Date()),
      time: "",
    }));

    if (errors.date) {
      setErrors((prev) => ({
        ...prev,
        date: "",
      }));
    }
  };
  // const selectTomorrow = () => {
  //   const tomorrow = new Date();
  //   tomorrow.setDate(tomorrow.getDate() + 1);

  //   setForm(prev => ({
  //     ...prev,
  //     date: formatDate(tomorrow),
  //     time: "",
  //   }));
  // };
  const selectTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    setForm((prev) => ({
      ...prev,
      date: formatDate(tomorrow),
      time: "",
    }));

    if (errors.date) {
      setErrors((prev) => ({
        ...prev,
        date: "",
      }));
    }
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
      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

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
                  ref={nameRef}
                  name="name"
                  // className="input"
                  className={`input ${
                      errors.name ? "border-red-500" : ""
                  }`}

                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  onKeyDown={handleEnterNext}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name}
                </p>
              )}
              {/* <input type="date" name="dob" className="input" onChange={handleChange} onKeyDown={handleEnterNext}/>
              <div className="input flex items-center">
                Age: {calculateAge(form.dob)} Years
              </div> */}

              {/* <input
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
              /> */}
              <input
                type="date"
                value={form.dob}
                max={new Date().toISOString().split("T")[0]}
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
              {/* <input
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
              /> */}
              {/* <input
                name="phone"
                placeholder="Contact Number"
                maxLength={10}
                inputMode="numeric"
                value={form.phone}
                className={`input ${errors.phone ? "border-red-500" : ""}`}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");

                  setForm((prev) => ({
                    ...prev,
                    phone: value,
                  }));

                  if (errors.phone) {
                    setErrors((prev) => ({
                      ...prev,
                      phone: "",
                    }));
                  }
                }}
                onKeyDown={handleEnterNext}
              /> */}

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
              {/* <input 
              name="phone" 
              placeholder="Contact Number" 
              className="input" 
              onChange={handleChange} 
              onKeyDown={handleEnterNext}
              /> */}
              <input
                  name="phone"
                  value={form.phone}
                  maxLength={10}
                  inputMode="numeric"
                  className={`input ${errors.phone ? "border-red-500" : ""}`}
                  onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");

                      setForm((prev) => ({
                          ...prev,
                          phone: value,
                      }));

                      if (errors.phone) {
                          setErrors((prev) => ({
                              ...prev,
                              phone: "",
                          }));
                      }
                  }}
              />

              {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                      {errors.phone}
                  </p>
              )}              
              <input name="emergency_person" placeholder="Father/Husband Name" className="input" onChange={handleChange} onKeyDown={handleEnterNext}/>
              <input name="address" placeholder="Address" className="input col-span-2 md:col-span-3" onChange={handleChange} onKeyDown={handleEnterNext}/>
            </div>

            <div className="p-4 grid grid-cols-2 gap-4">
              <input name="emergency_contact" placeholder="Alternative Number" className="input" onChange={handleChange} onKeyDown={handleEnterNext}/>
              {/* <input name="email" placeholder="Email Address" className="input" onChange={handleChange} onKeyDown={handleEnterNext}/> */}
              <input
                name="email"
                placeholder="Email Address"
                value={form.email}
                className={`input ${errors.email ? "border-red-500" : ""}`}
                onChange={handleChange}
                onKeyDown={handleEnterNext}
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email}
                </p>
              )}

            </div>
          </div>

          {/* 🔷 APPOINTMENT */}
          <div className="border rounded-xl overflow-hidden">
            <div className="bg-blue-100 px-4 py-2 font-medium text-blue-800">
              Schedule Appointment
            </div>

            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* <input name="doctor_id" placeholder="Doctor" className="input" onChange={handleChange} /> */}

              {/* <select name="doctor_id" className="input" onChange={handleChange} onKeyDown={handleEnterNext}>
                <option>Select Doctor</option>
                
                
                
                */}
              <select
                name="doctor_id"
                value={form.doctor_id}
                className={`input ${errors.doctor_id ? "border-red-500" : ""}`}
                disabled={loadingDoctors}
                // onChange={handleChange}
                onChange={(e) => {
                    handleChange(e);

                    if (errors.doctor_id) {
                        setErrors(prev => ({
                            ...prev,
                            doctor_id: "",
                        }));
                    }
                }}

                onKeyDown={handleEnterNext}
              >
                <option value="">
                  {loadingDoctors ? "Loading doctors..." : "Select Doctor"}
                </option>
                    {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name}
                    </option>
                  ))}
              </select>
              
              {/* <input type="date" name="date" className="input" onChange={handleChange} /> */}
              {/* <input type="time" name="time" className="input" onChange={handleChange} /> */}
                {/* <input
                  type="date"
                  name="date"
                  // className="input flex-1"
                  className={`input flex-1 ${
                      errors.date ? "border-red-500" : ""
                  }`}

                  value={form.date}
                  onChange={handleChange}
                  onKeyDown={handleEnterNext}
                />
                
                 */}

                <input
                  type="date"
                  name="date"
                  className={`input flex-1 ${
                    errors.date ? "border-red-500" : ""
                  }`}
                  value={form.date}
                  onChange={(e) => {
                    handleChange(e);

                    if (errors.date) {
                      setErrors((prev) => ({
                        ...prev,
                        date: "",
                      }));
                    }
                  }}
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
                {errors.date && (
                <p className="text-red-500 text-sm mt-1">
                    {errors.date}
                </p>
                )}            
            {loadingSlots && (
              <p className="text-blue-600 font-medium mb-3">
                Loading available slots...
              </p>
            )}
            {errors.doctor_id && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.doctor_id}
                </p>
              )}
            <div className="grid grid-cols-6 gap-3 mt-4">
              {slots.map((slot) => {
                const isBooked = bookedSlots.includes(slot);
                const isSelected = form.time === slot;

                return (
                  <div
                    key={slot}
                    // onClick={() => !isBooked && setForm({ ...form, time: slot })}


                    onClick={() => {
                        if (!form.doctor_id || !form.date) {
                            setError("Please select doctor and appointment date first.");
                            return;
                        }

                        if (!isBooked) {
                            setForm((prev) => ({
                                ...prev,
                                time: slot,
                            }));

                            if (errors.time) {
                                setErrors((prev) => ({
                                    ...prev,
                                    time: "",
                                }));
                            }

                            setError("");
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
            <p className="text-red-500 text-sm mt-2">
                {errors.time}
            </p>
            )}

            <div className="p-4">
              <textarea name="notes" placeholder="Notes" className="input w-full" onChange={handleChange} />
            </div>
          </div>

          {/* 🔥 BUTTON RIGHT SIDE */}
          <div className="flex justify-end">
            {/* <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Register Patient
            </button> */}

            <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-8 py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {saving ? "Registering..." : "Register Patient"}
            </button>

          </div>

        </div>
      </form>
    </div>
  );

}

export default RegisterPatient;