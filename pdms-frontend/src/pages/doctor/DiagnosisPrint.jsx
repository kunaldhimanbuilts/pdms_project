import React from "react";
export default function DiagnosisPrint({
  patient,
  appointment,
  printData,
  getMedicineName,
  calculateAge,
}) {
const handlePrint = () => {
    window.print();
};
  return (
        <div className="print-area-v2">
          <div className="a4-page">
            <div className="border-2 border-blue-900">
                <div className="bg-blue-900 text-white px-5 py-3">
                    <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-white text-blue-900 flex items-center justify-center text-3xl font-bold">
                        👁
                        </div>
                        <div>
                        <h1 className="text-4xl font-extrabold tracking-wide uppercase">
                            S&D Eye Care Centre
                        </h1>
                        <p className="text-sm italic">
                            Because We Care For Your Vision...
                        </p>
                        <p className="text-xs mt-1">
                            Rehri Road, Tajpura Bus Stand, Behat Road,
                            Saharanpur - 247120 (U.P.)
                        </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm">
                        Reg. No. B.OPT / 513
                        </p>
                        <p className="text-lg font-bold mt-3">
                        📞 8077799516
                        </p>
                    </div>
                    </div>
                </div>
                <div className="flex justify-between border-t border-blue-900 px-5 py-2 text-sm">
                    <div>
                    <p className="font-semibold">
                        OPD Prescription
                    </p>
                    </div>
                    <div className="text-right">
                    <h2 className="font-bold text-lg">
                        Dr. Deepak Kumar
                    </h2>
                    <p>B. Optom</p>
                    <p>Eye Care Specialist</p>
                    </div>
                </div>
            </div>
            <div className="border border-black mt-3">
                <div className="bg-gray-100 px-2 py-1 font-bold border-b">
                    Patient Details
                </div>
                <table className="w-full text-sm">
                    <tbody>
                        <tr>
                            <td className="border p-2">
                            <b>Patient ID</b>
                            </td>
                            <td className="border p-2">
                            {patient?.patient_code}
                            </td>
                            <td className="border p-2">
                            <b>Date</b>
                            </td>
                            <td className="border p-2">
                            {new Date().toLocaleDateString()}
                            </td>
                        </tr>
                        <tr>
                            <td className="border p-2">
                            <b>Name</b>
                            </td>
                            <td className="border p-2">
                            {patient?.name}
                            </td>
                            <td className="border p-2">
                            <b>Age / Sex</b>
                            </td>
                            <td className="border p-2">
                            {calculateAge(patient?.dob)} / {patient?.gender}
                            </td>
                        </tr>
                        <tr>
                            <td className="border p-2">
                            <b>Phone</b>
                            </td>
                            <td className="border p-2">
                            {patient?.phone}
                            </td>
                            <td className="border p-2">
                            <b>Blood Group</b>
                            </td>
                            <td className="border p-2">
                            {patient?.blood_group}
                            </td>
                        </tr>
                        <tr>
                            <td className="border p-2">
                            <b>Address</b>
                            </td>
                            <td
                            colSpan="3"
                            className="border p-2"
                            >
                            {patient?.address}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="border border-black mt-3">
            <div className="bg-gray-100 border-b p-2 font-bold">
                Vision Assessment
            </div>
            <table className="w-full text-sm">
                <thead>
                <tr className="bg-gray-50">
                    <th className="border p-2"></th>
                    <th className="border p-2">
                    OD
                    </th>
                    <th className="border p-2">
                    OS
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="border p-2">
                    Distance Vision
                    </td>
                    <td className="border p-2">
                    {printData?.refraction?.unaided?.re_distance || "-"}
                    </td>
                    <td className="border p-2">
                    {printData?.refraction?.unaided?.le_distance || "-"}
                    </td>
                </tr>
                <tr>
                    <td className="border p-2">
                    Near Vision
                    </td>
                    <td className="border p-2">
                    {printData?.refraction?.unaided?.re_near || "-"}
                    </td>
                    <td className="border p-2">
                    {printData?.refraction?.unaided?.le_near || "-"}
                    </td>
                </tr>
                <tr>
                    <td className="border p-2">
                    IOP
                    </td>
                    <td className="border p-2">
                    {printData?.ocular_exam?.iop?.re || "-"}
                    </td>
                    <td className="border p-2">
                    {printData?.ocular_exam?.iop?.le || "-"}
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="border border-black">
                <div className="bg-gray-100 border-b p-2 font-bold">
                Chief Complaints
                </div>
                <div className="p-2 text-sm min-h-[130px]">
                {printData?.chief_complaints?.length > 0 ? (
                    printData.chief_complaints
                    .filter(c => c.complaint)
                    .map((c, i) => (
                        <div key={i} className="mb-1">
                        • <b>{c.complaint}</b>
                        {c.eye && ` (${c.eye})`}
                        {c.duration && ` - ${c.duration}`}
                        {c.comment && ` (${c.comment})`}
                        </div>
                    ))
                ) : (
                    <p>—</p>
                )}
                </div>
            </div>
            <div className="border border-black">
                <div className="bg-gray-100 border-b p-2 font-bold">
                History of Present Illness
                </div>
                <div className="p-2 text-sm min-h-[130px] whitespace-pre-wrap">
                {printData?.history_present_illness || "-"}
                </div>
            </div>
            </div>
            <div className="border border-black mt-3">
            <div className="bg-gray-100 border-b p-2 font-bold">
                Systemic History
            </div>
            <table className="w-full text-sm">
                <thead>
                <tr>
                    <th className="border p-2">Disease</th>
                    <th className="border p-2">Duration</th>
                    <th className="border p-2">Comment</th>
                </tr>
                </thead>
                <tbody>
                {printData?.systemic_history?.length > 0 ? (
                    printData.systemic_history
                    .filter(s => s.disease)
                    .map((s, i) => (
                        <tr key={i}>
                        <td className="border p-2">
                            {s.disease}
                        </td>
                        <td className="border p-2">
                            {s.duration || "-"}
                        </td>
                        <td className="border p-2">
                            {s.comment || "-"}
                        </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                    <td className="border p-2 text-center" colSpan="3">
                        No Systemic Disease
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
            <div className="border border-black mt-3">
            <div className="bg-gray-100 border-b p-2 font-bold">
                Refraction
            </div>
            <table className="w-full text-sm">
                <thead>
                <tr>
                    <th className="border p-2">Eye</th>
                    <th className="border p-2">SPH</th>
                    <th className="border p-2">CYL</th>
                    <th className="border p-2">AXIS</th>
                    <th className="border p-2">BCVA</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="border p-2 font-semibold">
                    OD
                    </td>
                    <td className="border p-2">
                    {printData?.refraction?.final_refraction?.re_sph || "-"}
                    </td>
                    <td className="border p-2">
                    {printData?.refraction?.final_refraction?.re_cyl || "-"}
                    </td>
                    <td className="border p-2">
                    {printData?.refraction?.final_refraction?.re_axis || "-"}
                    </td>
                    <td className="border p-2">
                    {printData?.refraction?.final_refraction?.re_distance_bcva || "-"}
                    </td>
                </tr>
                <tr>
                    <td className="border p-2 font-semibold">
                    OS
                    </td>
                    <td className="border p-2">
                    {printData?.refraction?.final_refraction?.le_sph || "-"}
                    </td>
                    <td className="border p-2">
                    {printData?.refraction?.final_refraction?.le_cyl || "-"}
                    </td>
                    <td className="border p-2">
                    {printData?.refraction?.final_refraction?.le_axis || "-"}
                    </td>
                    <td className="border p-2">
                    {printData?.refraction?.final_refraction?.le_distance_bcva || "-"}
                    </td>
                </tr>
                <tr>
                    <td className="border p-2 font-semibold">
                    ADD
                    </td>
                    <td className="border p-2">
                    {printData?.refraction?.pgp?.re_add || "-"}
                    </td>
                    <td className="border p-2">
                    {printData?.refraction?.pgp?.le_add || "-"}
                    </td>
                    <td className="border p-2">-</td>
                    <td className="border p-2">-</td>
                </tr>
                </tbody>
            </table>
            </div>
            
            <div className="border border-black mt-3">
            <div className="bg-gray-100 border-b p-2 font-bold">
                Retinoscopy
            </div>
            <table className="w-full text-sm">
                <thead>
                <tr>
                    <th className="border p-2">Type</th>
                    <th className="border p-2">OD</th>
                    <th className="border p-2">OS</th>
                </tr>
                </thead>
                <tbody>
                {printData?.refraction?.retinoscopy?.map((r, i) => (
                    <tr key={i}>
                    <td className="border p-2">
                        {r.type || "-"}
                    </td>
                    <td className="border p-2">
                        SPH {r.re_sph || "-"} &nbsp;
                        CYL {r.re_cyl || "-"} &nbsp;
                        AXIS {r.re_axis || "-"}
                    </td>
                    <td className="border p-2">
                        SPH {r.le_sph || "-"} &nbsp;
                        CYL {r.le_cyl || "-"} &nbsp;
                        AXIS {r.le_axis || "-"}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
            <div className="border border-black mt-3">
            <div className="bg-gray-100 border-b p-2 font-bold">
                Fundus Examination
            </div>
            <table className="w-full text-sm">
                <thead>
                <tr>
                    <th className="border p-2">Finding</th>
                    <th className="border p-2">OD</th>
                    <th className="border p-2">OS</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="border p-2">Media</td>
                    <td className="border p-2">{printData?.fundus?.media_re || "-"}</td>
                    <td className="border p-2">{printData?.fundus?.media_le || "-"}</td>
                </tr>
                <tr>
                    <td className="border p-2">Disc</td>
                    <td className="border p-2">{printData?.fundus?.disc_re || "-"}</td>
                    <td className="border p-2">{printData?.fundus?.disc_le || "-"}</td>
                </tr>
                <tr>
                    <td className="border p-2">Macula</td>
                    <td className="border p-2">{printData?.fundus?.macula_re || "-"}</td>
                    <td className="border p-2">{printData?.fundus?.macula_le || "-"}</td>
                </tr>
                <tr>
                    <td className="border p-2">Vessels</td>
                    <td className="border p-2">{printData?.fundus?.vessels_re || "-"}</td>
                    <td className="border p-2">{printData?.fundus?.vessels_le || "-"}</td>
                </tr>
                <tr>
                    <td className="border p-2">CDR</td>
                    <td className="border p-2">{printData?.fundus?.cdr_re || "-"}</td>
                    <td className="border p-2">{printData?.fundus?.cdr_le || "-"}</td>
                </tr>
                <tr>
                    <td className="border p-2 font-semibold">Diagnosis</td>
                    <td className="border p-2">{printData?.fundus?.diagnosis_re || "-"}</td>
                    <td className="border p-2">{printData?.fundus?.diagnosis_le || "-"}</td>
                </tr>
                </tbody>
            </table>
            </div>
            <div className="border border-black mt-3">
                <div className="bg-gray-100 border-b p-2 font-bold">
                    Clinical Impression
                </div>
                <div className="p-4 min-h-[80px] whitespace-pre-wrap">
                    {printData?.clinical_impression || "-"}
                </div>
            </div>
            <div className="border border-black mt-3">
                <div className="bg-gray-100 border-b p-2 font-bold">
                    Advice
                </div>
                <div className="p-4 min-h-[80px] whitespace-pre-wrap">
                    {printData?.advice || "-"}
                </div>
            </div>
            <div className="border border-black mt-3">
                <div className="bg-gray-100 border-b p-2 font-bold">
                    Plan of Management
                </div>
                <div className="min-h-[140px] p-4">
                    ___________________________________________
                    <br /><br />
                    ____________________________________________
                    <br /><br />
                    ____________________________________________
                </div>
            </div>
            <div className="flex justify-between items-end mt-12">
                <div className="text-sm">
                    <p><b>Next Visit :</b> {printData?.next_visit_date || "As Advised"}</p>
                    <p>{printData?.next_visit_reason || ""}</p>
                </div>
                <div className="text-center">
                    <div className="border-t border-black w-48 mb-2"></div>
                    <p className="font-semibold">
                        Doctor Signature
                    </p>
                </div>
            </div>
          </div>
        </div>
  );
}