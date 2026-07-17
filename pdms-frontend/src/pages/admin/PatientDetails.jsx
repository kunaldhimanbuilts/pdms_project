import { useEffect, useState } from "react";
import api from "../../services/api";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function PatientDetails() {
  const [apptIndex, setApptIndex] = useState(0);
  const visibleCount = 4;
  const [medicines, setMedicines] = useState([]);
  const navigate = useNavigate(); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDetails();

    // 🔥 fetch medicines
    api.get("/medicines/").then(res => setMedicines(res.data));
  }, []);
  const getMedicineName = (id) => {
    const med = medicines.find(m => m.id === id);
    return med ? med.name : `ID: ${id}`;
  };

  const fetchDetails = async () => {
    const res = await api.get(`/admin/patients/${id}`);
    setData(res.data);
  };

  if (!data) return <p>Loading...</p>;

  const { patient, appointments, diagnosis_v2 = [] } = data;
  const history = diagnosis_v2;
  const calculateAge = (dob) => {
    if (!dob) return "-";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };
  const getStatusColor = (status) => {
    if (!status) return "bg-gray-200 text-gray-700";

    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };
  const visibleAppointments = appointments.slice(
    apptIndex,
    apptIndex + visibleCount
  );

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <button
        onClick={() => navigate("/admin")}
        className="mb-4 bg-white px-4 py-2 rounded-lg font-bold text-grey-800 shadow hover:bg-gray-100 "
      >
       Back
      </button>

      <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4 mb-6">

        {/* Avatar */}
        <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-xl font-bold text-blue-700">
          {patient.name?.[0]}
        </div>

        {/* Info */}
        <div className="flex-1">

          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">
              {patient.name} ({patient.patient_code})
            </h2>

            
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <p><b>Phone:</b> {patient.phone}</p>
            <p><b>DOB:</b> {patient.dob} | {calculateAge(patient.dob)} yrs</p>

            <p><b>Address:</b> {patient.address}</p>
            <p><b>Gender:</b> {patient.gender}</p>

            <p><b>Blood Group:</b> {patient.blood_group}</p>
            <p><b>Marital Status:</b> {patient.marital_status}</p>

            <p><b>Insurance:</b> {patient.insurance}</p>

            <p><b>Emergency Contact:</b> {patient.emergency_contact}</p>
            
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">

        <div className="bg-blue-500 text-white p-4 rounded">
          <p>Total Appointments</p>
          <h2 className="text-xl">{appointments.length}</h2>
        </div>

        <div className="bg-green-500 text-white p-4 rounded">
          <p>Total Prescriptions</p>
          <h2 className="text-xl">
            
            {diagnosis_v2.reduce((acc, d) => acc + d.prescriptions.length, 0)}
          </h2>
        </div>

        <div className="bg-purple-500 text-white p-4 rounded">
          <p>Diagnoses</p>
          <h2 className="text-xl">
            
            {diagnosis_v2.length}

          </h2>
        </div>

        <div className="bg-red-500 text-white p-4 rounded">
          <p>Last Condition</p>
          <h2 className="text-sm">
            
            {diagnosis_v2[0]?.diagnosis?.clinical_impression || "N/A"}
          </h2>
        </div>

      </div>

      {/* Tabs */}
      <div className="bg-white p-6 rounded-xl shadow">

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Appointments</h2>

          <div className="flex gap-2">
            <button
              onClick={() =>
                setApptIndex(prev => (prev > 0 ? prev - 1 : 0))
              }
              className="bg-white border px-3 py-1 rounded-lg shadow-sm hover:bg-gray-100"
            >
              {"<"}
            </button>

            <button
              onClick={() =>
                setApptIndex(prev =>
                  prev + visibleCount < appointments.length
                    ? prev + 1
                    : prev
                )
              }
              className="bg-white border px-3 py-1 rounded-lg shadow-sm hover:bg-gray-100"
            >
              {">"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {visibleAppointments.map((a, index) => {
          const globalIndex = apptIndex + index + 1;

            return (
              <div
                key={a.id}
                className="relative bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >

                
                {/* 🔢 NUMBER BADGE */}
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow">
                  #{globalIndex}
                </div>

                {/* HEADER */}
                <div className="flex justify-between items-center mb-2 pl-6">
                  <p className="text-sm text-gray-500">
                    {new Date(a.date).toLocaleDateString()}
                  </p>

                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(a.status)}`}>
                    {a.status}
                  </span>
                </div>

                {/* DOCTOR */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center font-bold text-blue-700">
                    {a.doctor_name?.[0] || "D"}
                  </div>

                  <div>
                    <p className="font-semibold">{a.doctor_name || "Doctor"}</p>
                    <p className="text-xs text-gray-500">Ophthalmologist</p>
                  </div>
                </div>

                {/* DETAILS */}
                <div className="text-sm space-y-1">
                  <p><b>Time:</b> {a.time || "—"}</p>
                  <p><b>Notes:</b> {a.notes || "—"}</p>
                </div>
              </div>
            );
          })}
        </div>

        
        <div className="bg-white p-6 rounded-xl shadow mb-6">
         
          <div className="flex items-center justify-between mb-4">

            {/* LEFT SIDE: TITLE + BUTTONS */}
            <div className="flex items-center gap-3">

              <h2 className="font-semibold text-lg">Diagnosis History</h2>

              

            </div>
            <div className="text-sm text-gray-500">
              {history.length > 0 && `${currentIndex + 1} / ${history.length}`}
            </div>            
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev))
                }
                className="bg-white border px-3 py-1 rounded-lg shadow-sm hover:bg-gray-100"
              >
                {"<"}
              </button>

              <button
                onClick={() =>
                  setCurrentIndex(prev =>
                    prev < history.length - 1 ? prev + 1 : prev
                  )
                }
                className="bg-white border px-3 py-1 rounded-lg shadow-sm hover:bg-gray-100"
              >
                {">"}
              </button>
            </div>
            
            

          </div>
          {history.length === 0 && (
            <p className="text-gray-500">No records found</p>
          )}

          {history.length > 0 && (
            <div className="relative">
              

              {/* CARD */}
              <div className="mx-10 bg-blue-50 p-5 rounded-xl shadow">

                {(() => {
                  const d = history[currentIndex];

                  return (
                    <div className="space-y-4 text-sm">

                      {/* HEADER */}
                      <div className="flex justify-between text-gray-500 border-b pb-2">
                        <p>{new Date(d.diagnosis.created_at).toLocaleDateString()}</p>
                        <p className="font-semibold text-blue-700">{d.doctor_name}</p>
                      </div>

                      {/* 🔴 COMPLAINT BLOCK */}
                      <div className="grid grid-cols-3 gap-4 ">
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <p className="font-semibold text-red-600 mb-1">Chief Complaints</p>
                          {d.diagnosis.chief_complaints?.map((c,i)=>(
                            <p key={i}>
                            • {c.complaint} ({c.eye}) - {c.duration} | {c.comment || "—"}
                            </p>
                          ))}
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <p className="font-semibold text-gray-700 mb-1">Systemic History</p>

                          {d.diagnosis.systemic_history?.map((s,i)=>(
                            <p key={i}>
                              • {s.disease} ({s.duration}) - {s.comment || "—"}
                            </p>
                          ))}
                        </div>
                      

                        {/* 🔴 HISTORY BLOCK */}
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <p className="font-semibold text-gray-700 mb-1">History</p>
                          <p><b>HPI:</b> {d.diagnosis.history_present_illness || "—"}</p>
                          <p><b>Surgery:</b> {d.diagnosis.surgery_history || "—"}</p>
                          <p><b>Allergy:</b> {d.diagnosis.allergy_history || "—"}</p>
                        </div>
                      </div>
                                          
                      {/* ================= REFRACTION ================= */}

                      <div className="bg-white p-3 rounded-lg shadow-sm">

                        <p className="font-semibold text-blue-600 mb-3">
                          Refraction
                        </p>

                        {/* ================= UNAIDED ================= */}
                        <div className="grid grid-cols-2 gap-4 ">
                          <div className="mb-4 border rounded-lg p-3">

                            <p className="font-semibold mb-2">
                              UNAIDED
                            </p>

                            <div className="grid grid-cols-2 gap-6">

                              <div>

                                <p className="font-semibold text-green-600">
                                  Right Eye (RE)
                                </p>

                                <p>Distance : {d.diagnosis.refraction?.unaided?.re_distance || "—"}</p>
                                <p>Pinhole : {d.diagnosis.refraction?.unaided?.re_pinhole || "—"}</p>
                                <p>Near : {d.diagnosis.refraction?.unaided?.re_near || "—"}</p>

                              </div>

                              <div>

                                <p className="font-semibold text-purple-600">
                                  Left Eye (LE)
                                </p>

                                <p>Distance : {d.diagnosis.refraction?.unaided?.le_distance || "—"}</p>
                                <p>Pinhole : {d.diagnosis.refraction?.unaided?.le_pinhole || "—"}</p>
                                <p>Near : {d.diagnosis.refraction?.unaided?.le_near || "—"}</p>

                              </div>

                            </div>

                            <p className="mt-2">
                              Distance Chart :
                              {d.diagnosis.refraction?.unaided?.distance_chart || "—"}
                            </p>

                            <p>
                              Near Chart :
                              {d.diagnosis.refraction?.unaided?.near_chart || "—"}
                            </p>

                            <p>
                              Comment :
                              {d.diagnosis.refraction?.unaided?.comment || "—"}
                            </p>

                          </div>


                          {/* ================= PGP ================= */}

                          <div className="mb-4 border rounded-lg p-3">

                            <p className="font-semibold mb-2">
                              PGP
                            </p>

                            <div className="grid grid-cols-2 gap-6">

                              <div>

                                <p className="font-semibold text-green-600">
                                  Right Eye
                                </p>

                                <p>
                                  {d.diagnosis.refraction?.pgp?.re_sph || "—"} /
                                  {d.diagnosis.refraction?.pgp?.re_cyl || "—"} ×
                                  {d.diagnosis.refraction?.pgp?.re_axis || "—"}
                                </p>

                                <p>
                                  Distance Vision :
                                  {d.diagnosis.refraction?.pgp?.re_vision_before || "—"}
                                </p>

                                <p>
                                  ADD :
                                  {d.diagnosis.refraction?.pgp?.re_add || "—"}
                                </p>

                                <p>
                                  Near Vision :
                                  {d.diagnosis.refraction?.pgp?.re_vision_after || "—"}
                                </p>

                              </div>

                              <div>

                                <p className="font-semibold text-purple-600">
                                  Left Eye
                                </p>

                                <p>
                                  {d.diagnosis.refraction?.pgp?.le_sph || "—"} /
                                  {d.diagnosis.refraction?.pgp?.le_cyl || "—"} ×
                                  {d.diagnosis.refraction?.pgp?.le_axis || "—"}
                                </p>

                                <p>
                                  Distance Vision :
                                  {d.diagnosis.refraction?.pgp?.le_vision_before || "—"}
                                </p>

                                <p>
                                  ADD :
                                  {d.diagnosis.refraction?.pgp?.le_add || "—"}
                                </p>

                                <p>
                                  Near Vision :
                                  {d.diagnosis.refraction?.pgp?.le_vision_after || "—"}
                                </p>

                              </div>

                            </div>

                            <p className="mt-2">
                              Lens :
                              {d.diagnosis.refraction?.pgp?.lens_type || "—"}
                            </p>

                            <p>
                              Comment :
                              {d.diagnosis.refraction?.pgp?.comment || "—"}
                            </p>

                          </div>

                        </div>
                        {/* ================= RETINOSCOPY ================= */}
                        <div className="grid grid-cols-2 gap-4 ">
                          {d.diagnosis.refraction?.retinoscopy?.map((r, index) => (

                            <div
                              key={index}
                              className="border rounded-lg p-3 mb-4"
                            >
                              <div className="grid grid-cols-3 gap-4 ">
                                <p className="font-semibold">
                                  Retinoscopy #{index + 1}
                                </p>

                                <p>Type : {r.type || "—"}</p>
                              </div>  
                              <div className="grid grid-cols-2 gap-6 mt-2">

                                <div>

                                  <p className="font-semibold text-green-600">RE</p>

                                  <p>
                                    {r.re_sph || "—"} /
                                    {r.re_cyl || "—"} ×
                                    {r.re_axis || "—"}
                                  </p>

                                  <p>Glow : {r.re_glow || "—"}</p>

                                </div>

                                <div>

                                  <p className="font-semibold text-purple-600">LE</p>

                                  <p>
                                    {r.le_sph || "—"} /
                                    {r.le_cyl || "—"} ×
                                    {r.le_axis || "—"}
                                  </p>

                                  <p>Glow : {r.le_glow || "—"}</p>

                                </div>

                              </div>

                            </div>

                          ))}

                        </div>
                        {/* ================= FINAL REFRACTION ================= */}

                        <div className="border rounded-lg p-3">

                          <p className="font-semibold mb-2">
                            FINAL REFRACTION
                          </p>

                          <div className="grid grid-cols-2 gap-6">

                            <div>

                              <p className="font-semibold text-green-600">
                                Right Eye
                              </p>

                              <p>
                                {d.diagnosis.refraction?.final_refraction?.re_sph || "—"} /
                                {d.diagnosis.refraction?.final_refraction?.re_cyl || "—"} ×
                                {d.diagnosis.refraction?.final_refraction?.re_axis || "—"}
                              </p>

                              <p>
                                BCVA :
                                {d.diagnosis.refraction?.final_refraction?.re_bcva || "—"}
                              </p>

                              <p>
                                ADD :
                                {d.diagnosis.refraction?.final_refraction?.re_add || "—"}
                              </p>

                              <p>
                                Near BCVA :
                                {d.diagnosis.refraction?.final_refraction?.re_near_bcva || "—"}
                              </p>

                            </div>

                            <div>

                              <p className="font-semibold text-purple-600">
                                Left Eye
                              </p>

                              <p>
                                {d.diagnosis.refraction?.final_refraction?.le_sph || "—"} /
                                {d.diagnosis.refraction?.final_refraction?.le_cyl || "—"} ×
                                {d.diagnosis.refraction?.final_refraction?.le_axis || "—"}
                              </p>

                              <p>
                                BCVA :
                                {d.diagnosis.refraction?.final_refraction?.le_bcva || "—"}
                              </p>

                              <p>
                                ADD :
                                {d.diagnosis.refraction?.final_refraction?.le_add || "—"}
                              </p>

                              <p>
                                Near BCVA :
                                {d.diagnosis.refraction?.final_refraction?.le_near_bcva || "—"}
                              </p>

                            </div>

                          </div>

                          <p className="mt-2">
                            Distance Chart :
                            {d.diagnosis.refraction?.final_refraction?.chart || "—"}
                          </p>

                          <p>
                            Near Chart :
                            {d.diagnosis.refraction?.final_refraction?.chart_type || "—"}
                          </p>

                          <p>
                            At :
                            {d.diagnosis.refraction?.final_refraction?.at || "—"} cm
                          </p>

                          <p>
                            Comment :
                            {d.diagnosis.refraction?.final_refraction?.comment || "—"}
                          </p>
                          <p>
                            Lens type :
                            {d.diagnosis.refraction?.final_refraction?.lens_pres_type || "—"}
                          </p>
                          <p>
                            Lens Coating :
                            {d.diagnosis.refraction?.final_refraction?.lens_pres_coat || "—"}
                          </p>

                        </div>

                      </div>
                      {/* ================= OCULAR EXAMINATION ================= */}

                      <div className="bg-white p-3 rounded-lg shadow-sm">

                        <p className="font-semibold text-blue-600 mb-2">
                          Ocular Examination
                        </p>

                        <table className="w-full text-xs border border-gray-300">

                          <thead className="bg-gray-100">

                            <tr>
                              <th className="border p-1 text-left">Exam</th>
                              <th className="border p-1">RE</th>
                              <th className="border p-1">LE</th>
                            </tr>

                          </thead>

                          <tbody>

                            <tr>
                              <td className="border p-1">Motility</td>
                              <td className="border p-1">{d.diagnosis.ocular_exam?.motility?.re || "—"}</td>
                              <td className="border p-1">{d.diagnosis.ocular_exam?.motility?.le || "—"}</td>
                            </tr>

                            <tr>
                              <td className="border p-1">Lid</td>
                              <td className="border p-1">{d.diagnosis.ocular_exam?.slit_lamp?.eyeball_re || "—"}</td>
                              <td className="border p-1">{d.diagnosis.ocular_exam?.slit_lamp?.eyeball_le || "—"}</td>
                            </tr>

                            <tr>
                              <td className="border p-1">Conj</td>
                              <td className="border p-1">{d.diagnosis.ocular_exam?.slit_lamp?.conj_re || "—"}</td>
                              <td className="border p-1">{d.diagnosis.ocular_exam?.slit_lamp?.conj_le || "—"}</td>
                            </tr>

                            <tr>
                              <td className="border p-1">Sclera</td>
                              <td className="border p-1">{d.diagnosis.ocular_exam?.slit_lamp?.sclera_re || "—"}</td>
                              <td className="border p-1">{d.diagnosis.ocular_exam?.slit_lamp?.sclera_le || "—"}</td>
                            </tr>

                            <tr>
                              <td className="border p-1">Cornea</td>
                              <td className="border p-1">{d.diagnosis.ocular_exam?.slit_lamp?.cornea_re || "—"}</td>
                              <td className="border p-1">{d.diagnosis.ocular_exam?.slit_lamp?.cornea_le || "—"}</td>
                            </tr>

                            <tr>
                              <td className="border p-1">AC</td>
                              <td className="border p-1">{d.diagnosis.ocular_exam?.slit_lamp?.ac_re || "—"}</td>
                              <td className="border p-1">{d.diagnosis.ocular_exam?.slit_lamp?.ac_le || "—"}</td>
                            </tr>

                            <tr>
                              <td className="border p-1">Iris</td>
                              <td className="border p-1">{d.diagnosis.ocular_exam?.slit_lamp?.iris_re || "—"}</td>
                              <td className="border p-1">{d.diagnosis.ocular_exam?.slit_lamp?.iris_le || "—"}</td>
                            </tr>

                            <tr>
                              <td className="border p-1">Pupil</td>
                              <td className="border p-1">{d.diagnosis.ocular_exam?.slit_lamp?.pupil_re || "—"}</td>
                              <td className="border p-1">{d.diagnosis.ocular_exam?.slit_lamp?.pupil_le || "—"}</td>
                            </tr>

                            <tr>
                              <td className="border p-1">IOP</td>
                              <td className="border p-1">{d.diagnosis.ocular_exam?.iop?.re || "—"}</td>
                              <td className="border p-1">{d.diagnosis.ocular_exam?.iop?.le || "—"}</td>
                            </tr>

                            <tr>
                              <td className="border p-1">Lacrimal</td>
                              <td className="border p-1">{d.diagnosis.ocular_exam?.lacrimal?.re || "—"}</td>
                              <td className="border p-1">{d.diagnosis.ocular_exam?.lacrimal?.le || "—"}</td>
                            </tr>

                            <tr>
                              <td className="border p-1">Schirmer</td>
                              <td className="border p-1">{d.diagnosis.ocular_exam?.schirmer?.re || "—"} mm</td>
                              <td className="border p-1">{d.diagnosis.ocular_exam?.schirmer?.le || "—"} mm</td>
                            </tr>

                            <tr>
                              <td className="border p-1">Colour</td>
                              <td className="border p-1">{d.diagnosis.ocular_exam?.color_vision?.re || "—"}</td>
                              <td className="border p-1">{d.diagnosis.ocular_exam?.color_vision?.le || "—"}</td>
                            </tr>

                          </tbody>

                        </table>

                        <div className="grid grid-cols-2 gap-4 mt-2 text-xs">

                          <div>
                            <p><b>RE Slit Comment:</b> {d.diagnosis.ocular_exam?.slit_lamp?.slit_re_comment || "—"}</p>
                            <p><b>RE Colour Comment:</b> {d.diagnosis.ocular_exam?.color_vision?.re_comment || "—"}</p>
                          </div>

                          <div>
                            <p><b>OS Slit Comment:</b> {d.diagnosis.ocular_exam?.slit_lamp?.slit_le_comment || "—"}</p>
                            <p><b>OS Colour Comment:</b> {d.diagnosis.ocular_exam?.color_vision?.le_comment || "—"}</p>
                          </div>

                        </div>

                        <div className="flex flex-wrap gap-6 mt-2 text-xs">

                          <span>
                            <b>IOP Method:</b>{" "}
                            {d.diagnosis.ocular_exam?.iop?.method || "—"}
                          </span>

                          <span>
                            <b>Time:</b>{" "}
                            {d.diagnosis.ocular_exam?.iop?.time || "—"}
                          </span>

                          <span>
                            <b>Schirmer Type:</b>{" "}
                            {d.diagnosis.ocular_exam?.schirmer?.type || "—"}
                          </span>

                          <span>
                            <b>Schirmer Time:</b>{" "}
                            {d.diagnosis.ocular_exam?.schirmer?.time || "—"}
                          </span>

                          <span>
                            <b>Lacrimal Comment:</b>{" "}
                            {d.diagnosis.ocular_exam?.lacrimal?.comment || "—"}
                          </span>

                        </div> 

                      </div>
                      {/* ================= POST DILATED EXAMINATION ================= */}
<div className= "grid grid-cols-3 gap-2 ">
                      <div className="bg-white p-3 rounded-lg shadow-sm">

                          <p className="font-semibold text-blue-600 mb-2">
                              Post Dilated Examination
                          </p>

                          <table className="w-full text-xs border">

                              <thead className="bg-gray-100">
                                  <tr>
                                      <th className="border p-1">Examination</th>
                                      <th className="border p-1">RE</th>
                                      <th className="border p-1">LE</th>
                                  </tr>
                              </thead>

                              <tbody>

                                  <tr>
                                      <td className="border p-1">Dilating Drop</td>
                                      <td className="border p-1" colSpan={2}>
                                          
                                          {d.diagnosis.ocular_exam?.post_dilated_exam?.dilated_drop || "—"}
                                      </td>
                                  </tr>

                                  <tr>
                                      <td className="border p-1">Pupil Size</td>
                                      <td className="border p-1">
                                          {d.diagnosis.ocular_exam?.post_dilated_exam?.pupil_re_size || "—"}
                                      </td>

                                      <td className="border p-1">
                                          {d.diagnosis.ocular_exam?.post_dilated_exam?.pupil_le_size || "—"}
                                      </td>
                                  </tr>

                                  <tr>
                                      <td className="border p-1">Pupil Reaction</td>

                                      <td className="border p-1">
                                          {d.diagnosis.ocular_exam?.post_dilated_exam?.pupil_re_reaction || "—"}
                                      </td>

                                      <td className="border p-1">
                                          {d.diagnosis.ocular_exam?.post_dilated_exam?.pupil_le_reaction || "—"}
                                      </td>
                                  </tr>

                                  <tr>
                                      <td className="border p-1">Lens</td>

                                      <td className="border p-1">
                                          {d.diagnosis.ocular_exam?.post_dilated_exam?.lens_re || "—"}
                                      </td>

                                      <td className="border p-1">
                                          {d.diagnosis.ocular_exam?.post_dilated_exam?.lens_le || "—"}
                                      </td>
                                  </tr>

                              </tbody>

                          </table>

                          <div className="mt-2 text-xs">
                              <b>Comment :</b>{" "}
                              {d.diagnosis.ocular_exam?.post_dilated_exam?.comment || "—"}
                          </div>

                      </div>



                      {/* ================= FUNDUS ================= */}

                      <div className="bg-white p-3 rounded-lg shadow-sm col-span-2">

                          <p className="font-semibold text-blue-600 mb-2">
                              Fundus Examination
                          </p>

                          <table className="w-full text-xs border">

                              <thead className="bg-gray-100">
                                  <tr>
                                      <th className="border p-1">Examination</th>
                                      <th className="border p-1">RE</th>
                                      <th className="border p-1">LE</th>
                                  </tr>
                              </thead>

                              <tbody>

                                  <tr>
                                      <td className="border p-1">Media</td>

                                      <td className="border p-1">
                                          {d.diagnosis.fundus?.be_media_re || "—"}
                                          {d.diagnosis.fundus?.media_re &&
                                              ` (${d.diagnosis.fundus.media_re})`}
                                      </td>

                                      <td className="border p-1">
                                          {d.diagnosis.fundus?.be_media_le || "—"}
                                          {d.diagnosis.fundus?.media_le &&
                                              ` (${d.diagnosis.fundus.media_le})`}
                                      </td>
                                  </tr>

                                  <tr>
                                      <td className="border p-1">PVD</td>

                                      <td className="border p-1">
                                          {d.diagnosis.fundus?.pvd_re || "—"}
                                      </td>

                                      <td className="border p-1">
                                          {d.diagnosis.fundus?.pvd_le || "—"}
                                      </td>
                                  </tr>

                                  <tr>
                                      <td className="border p-1">Optic Disc</td>

                                      <td className="border p-1">
                                          {d.diagnosis.fundus?.be_optic_re || "—"}
                                          {d.diagnosis.fundus?.optic_re &&
                                              ` (${d.diagnosis.fundus.optic_re})`}
                                      </td>

                                      <td className="border p-1">
                                          {d.diagnosis.fundus?.be_optic_le || "—"}
                                          {d.diagnosis.fundus?.optic_le &&
                                              ` (${d.diagnosis.fundus.optic_le})`}
                                      </td>
                                  </tr>

                                  <tr>
                                      <td className="border p-1">Disc Size</td>

                                      <td className="border p-1">
                                          {d.diagnosis.fundus?.opticsize_re || "—"}
                                      </td>

                                      <td className="border p-1">
                                          {d.diagnosis.fundus?.opticsize_le || "—"}
                                      </td>
                                  </tr>

                                  <tr>
                                      <td className="border p-1">CDR</td>

                                      <td className="border p-1">
                                          {d.diagnosis.fundus?.cdr_re || "—"}
                                      </td>

                                      <td className="border p-1">
                                          {d.diagnosis.fundus?.cdr_le || "—"}
                                      </td>
                                  </tr>

                                  <tr>
                                      <td className="border p-1">Fundus</td>

                                      <td className="border p-1">
                                          {d.diagnosis.fundus?.fundus_re || "—"}
                                      </td>

                                      <td className="border p-1">
                                          {d.diagnosis.fundus?.fundus_le || "—"}
                                      </td>
                                  </tr>

                                  <tr>
                                      <td className="border p-1 font-semibold">
                                          Diagnosis
                                      </td>

                                      <td className="border p-1">
                                          {d.diagnosis.fundus?.diagnosis_re || "—"}
                                      </td>

                                      <td className="border p-1">
                                          {d.diagnosis.fundus?.diagnosis_le || "—"}
                                      </td>
                                  </tr>

                              </tbody>

                          </table>

                          <div className="mt-2 text-xs">

                              <b>Diagnosis Comment :</b>{" "}
                              {d.diagnosis.fundus?.diagnosis_comment || "—"}

                          </div>

                      </div>
                      </div>
                      {/* 🔴 CLINICAL */}
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p><b>Clinical:</b> {d.diagnosis.clinical_impression}</p>
                      </div>

                      {/* 🔴 ADVICE */}
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p><b>Advice:</b> {d.diagnosis.advice}</p>
                      </div>

                      {/* 🔴 PRESCRIPTION */}
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="font-semibold mb-1">Prescription</p>
                        {d.prescriptions.map((p,i)=>(
                          <p key={i}>
                            • {p.medicine_name || getMedicineName(p.medicine_id)} | {p.dosage} | {p.duration} | {p.instructions}
                          </p>
                        ))}
                      </div>

                      {/* 🔴 NEXT VISIT */}
                      
                      {/* 🔵 NEXT VISIT */}
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p>
                          <b>Next Visit:</b>{" "}
                          {d.diagnosis.next_visit_date
                            ? `${new Date(d.diagnosis.next_visit_date).toLocaleDateString()}`
                            : "—"}
                          
                          {d.diagnosis.next_visit_reason
                            ? ` (${d.diagnosis.next_visit_reason})`
                            : ""}
                        </p>
                      </div>
                    </div>                                
                  );
                })()}

              </div>
            </div>
          )}
        </div>




      </div>

    </div>
  );
}

export default PatientDetails;