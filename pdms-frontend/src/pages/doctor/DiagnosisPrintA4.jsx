import React from "react";
import eye from "./sliteye.svg";
import feye from "./funduseye.svg";

import logo from "./logo.png";
export default function DiagnosisPrintA4({
  patient,
  appointment,
  printData,
  getMedicineName,
  calculateAge,
}) {

  const today = new Date().toLocaleDateString("en-GB");
  const doctor = JSON.parse(localStorage.getItem("doctor") || "{}");
  return (
    <div className="print-area">
      <div className="a4-page bg-white">

        {/* ================= HEADER ================= */}

        <div className="">

          <div className="flex justify-between items-start px-5 py-0.5">

            {/* LEFT */}

            <div className="flex gap-4">

              {/* LOGO */}

              <img
                src={logo}
                alt="logo"
                className="w-14 h-14 object-contain"
              />

              <div>

                <h1 className="text-[30px] font-extrabold tracking-wide text-[#213c8f] leading-none uppercase">
                  S&D EYE CARE CENTRE
                </h1>

                <p className="italic text-gray-600 text-xs mt-0">
                  Because We Care For Your Vision...
                </p>

                <p className="text-xs text-gray-700 mt-1">
                  Rehri Road, Tajpura Bus Stand,
                  Behat Road, Saharanpur - 247120 (U.P.)
                </p>

              </div>

            </div>

            {/* RIGHT */}

            <div className="text-right">

              <p className="font-bold text-xs text-gray-700">
                Reg. No. B.OPT / 513
              </p>

              <p className="font-bold text-xs mt-2">
                Mob: +91 8077799516
              </p>

              <p className="italic font-semibold text-[13px] mt-2 text-gray-700">
                OPD Prescription(Valid for 10 days)
              </p>

            </div>

          </div>

          <div className="border-t-[3px] border-[#213c8f]" />

        </div>

        {/* ================= PATIENT ROW ================= */}

        <div className="grid grid-cols-2 gap-5 mt-0.5">

          {/* Patient */}

          <div className="border rounded-md overflow-hidden ">

            <div className="bg-slate-100 border-b px-3 py-0 font-bold text-[#213c8f] text-[14px] uppercase">
              Patient Details
            </div>

            <div className="px-2 py-1">

              <div className="grid grid-cols-2 gap-y-0">

                <div>

                  <span className="font-semibold text-[13px]">
                    Patient ID:
                  </span>

                  <span className="ml-2 text-[13px]">
                    {patient?.patient_code}
                  </span>

                </div>

                <div>

                  <span className="font-semibold text-[13px]">
                    Date:
                  </span>

                  <span className="ml-2 text-[13px]">
                    {today}
                  </span>

                </div>

                <div>

                  <span className="font-semibold text-[13px]">
                    Name:
                  </span>

                  <span className="ml-2 text-[13px]">
                    {patient?.name}
                  </span>

                </div>

                <div>

                  <span className="font-semibold text-[13px]">
                    Age / Sex:
                  </span>

                  <span className="ml-2 text-[13px]">
                    {calculateAge(patient?.dob)} / {patient?.gender}
                  </span>

                </div>

              </div>

              <div className="mt-1 text-[13px]">

                <span className="font-semibold text-[13px]">
                  Address:
                </span>

                <span className="ml-2 text-[13px]">
                  {patient?.address}
                </span>

              </div>

            </div>

          </div>

          {/* Doctor */}

          <div className="border rounded-md overflow-hidden">

            <div className="bg-slate-100 border-b px-3 py-0 font-bold text-[#213c8f] text-[14px] uppercase">
              Clinical Provider
            </div>

            <div className="px-2 py-1 space-y-0.5">

              <div>

                <span className="font-semibold text-[13px]">
                  Doctor:
                </span>

                <span className="ml-2 font-bold text-[13px]">
                   {doctor?.name || "Doctor"}
                </span>

                <span className="ml-2 text-gray-600 text-[13px]">
                  (B. Optom)
                </span>

              </div>

              <div>

                <span className="font-semibold text-[13px]">
                  Specialty:
                </span>

                <span className="ml-2 text-[13px]">
                  Eye Care Specialist
                </span>

              </div>

              <div>

                <span className="font-semibold text-[13px]">
                  Timings:
                </span>

                <span className="ml-2 text-[13px]">
                  9:00 AM to 7:00 PM
                </span>

                <span className="text-red-600 font-semibold ml-2 text-[13px]">
                  Sunday Closed
                </span>

              </div>

            </div>

          </div>

        </div>
        {/* ================= VISION & REFRACTION ================= */}

        <div className="mt-0.5 border border-slate-400 rounded-md overflow-hidden">

            <div className="bg-[#213c8f] text-white font-bold text-[13px] uppercase px-4 tracking-wide">
                Vision & Refraction Matrix
            </div>

            <table className="w-full border-collapse text-[11px]">

                <thead>

                    <tr className="bg-gray-100">

                        <th className="border border-slate-300 py-0.5 px-1 w-44">
                            Assessment Type
                        </th>

                        <th className="border border-slate-300 py-0.5 px-1 w-16">
                            Eye
                        </th>

                        <th className="border border-slate-300 py-0.5 px-1">
                            SPH
                        </th>

                        <th className="border border-slate-300 py-0.5 px-1">
                            CYL
                        </th>

                        <th className="border border-slate-300 py-0.5 px-1">
                            AXIS
                        </th>

                        <th className="border border-slate-300 py-0.5 px-1">
                            BCVA
                        </th>

                        <th className="border border-slate-300 py-0.5 px-1">
                            Dist.
                        </th>

                        <th className="border border-slate-300 py-0.5 px-1">
                            Near
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {/* ================= PGP ================= */}

                    <tr>

                        <td
                            rowSpan="2"
                            className="border border-slate-300 py-1 px-2 font-semibold"
                        >
                            PGP (Past Glasses)
                        </td>

                        <td className="border border-slate-300 text-center font-semibold">
                            OD
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.pgp?.re_sph || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.pgp?.re_cyl || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.pgp?.re_axis || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.pgp?.re_vision_before || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.unaided?.re_distance || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.unaided?.re_near || ""}
                        </td>

                    </tr>

                    <tr>

                        <td className="border border-slate-300 text-center font-semibold">
                            OS
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.pgp?.le_sph || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.pgp?.le_cyl || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.pgp?.le_axis || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.pgp?.le_vision_before || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.unaided?.le_distance || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.unaided?.le_near || ""}
                        </td>

                    </tr>

                    {/* ================= RETINOSCOPY ================= */}

                    {printData?.refraction?.retinoscopy?.map((r, i) => (

                        <React.Fragment key={i}>

                            <tr>

                                {i === 0 && (

                                    <td
                                        rowSpan={printData.refraction.retinoscopy.length * 2}
                                        className="border border-slate-300 p-2 font-semibold"
                                    >
                                        Retinoscopy / AR
                                    </td>

                                )}

                                <td className="border border-slate-300 text-center font-semibold">
                                    OD
                                </td>

                                <td className="border border-slate-300 text-center">
                                    {r.re_sph}
                                </td>

                                <td className="border border-slate-300 text-center">
                                    {r.re_cyl}
                                </td>

                                <td className="border border-slate-300 text-center">
                                    {r.re_axis}
                                </td>

                                <td className="border border-slate-300 text-center">
                                    {r.re_glow}
                                </td>

                                <td className="border border-slate-300"></td>

                                <td className="border border-slate-300"></td>

                            </tr>

                            <tr>

                                <td className="border border-slate-300 text-center font-semibold">
                                    OS
                                </td>

                                <td className="border border-slate-300 text-center">
                                    {r.le_sph}
                                </td>

                                <td className="border border-slate-300 text-center">
                                    {r.le_cyl}
                                </td>

                                <td className="border border-slate-300 text-center">
                                    {r.le_axis}
                                </td>

                                <td className="border border-slate-300 text-center">
                                    {r.le_glow}
                                </td>

                                <td className="border border-slate-300"></td>

                                <td className="border border-slate-300"></td>

                            </tr>

                        </React.Fragment>

                    ))}

                    {/* ================= FINAL RX ================= */}

                    <tr>

                        <td
                            rowSpan="3"
                            className="border border-slate-300 py-1 px-2 font-semibold"
                        >
                            Final Prescription (RX)
                        </td>

                        <td className="border border-slate-300 text-center font-semibold">
                            OD
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.final_refraction?.re_sph || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.final_refraction?.re_cyl || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.final_refraction?.re_axis || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.final_refraction?.re_distance_bcva || ""}
                        </td>

                        <td className="border border-slate-300"></td>

                        <td className="border border-slate-300"></td>

                    </tr>

                    <tr>

                        <td className="border border-slate-300 text-center font-semibold">
                            OS
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.final_refraction?.le_sph || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.final_refraction?.le_cyl || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.final_refraction?.le_axis || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.final_refraction?.le_distance_bcva || ""}
                        </td>

                        <td className="border border-slate-300"></td>

                        <td className="border border-slate-300"></td>

                    </tr>

                    <tr>

                        <td className="border border-slate-300 text-center font-semibold">
                            ADD
                        </td>

                        <td
                            colSpan="3"
                            className="border border-slate-300 pl-2"
                        >
                            OD {printData?.refraction?.final_refraction?.re_add || ""}

                            &nbsp;&nbsp;&nbsp;&nbsp;

                            OS {printData?.refraction?.final_refraction?.le_add || ""}
                        </td>

                        <td
                            colSpan="3"
                            className="border border-slate-300 pl-2"
                        >
                            IOP OD {printData?.ocular_exam?.iop?.re || ""}

                            &nbsp;&nbsp;&nbsp;&nbsp;

                            OS {printData?.ocular_exam?.iop?.le || ""}

                            &nbsp;&nbsp;&nbsp;&nbsp;

                            Time: {printData?.ocular_exam?.iop?.time || ""}
                        </td>

                    </tr>

                </tbody>

            </table>

        </div>
            
        {/* ================= SLIT LAMP + FUNDUS ================= */}

        <div className="grid grid-cols-2 gap-2 mt-0.5">

        {/* ================= SLIT LAMP ================= */}

            <div className="border border-slate-400 rounded-md overflow-hidden">

                <div className="bg-[#213c8f] text-[13px] text-white px-3 font-bold uppercase">
                Slit Lamp Examination
                </div>

                <div className="">

                <div className="flex justify-center ">

                    {/* Eye Diagram */}

                    <img
                    src={eye}
                    alt="Eye"
                    className="h-23 object-contain"
                    />

                </div>

                <table className="w-full text-[10px]">

                    <tbody>

                    <tr>
                        <td className="font-semibold w-36">Eyeball</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.eyeball_re}</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.eyeball_le}</td>
                    </tr>

                    <tr>
                        <td className="font-semibold">Conjunctiva</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.conj_re}</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.conj_le}</td>
                    </tr>

                    <tr>
                        <td className="font-semibold">Sclera</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.sclera_re}</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.sclera_le}</td>
                    </tr>

                    <tr>
                        <td className="font-semibold">Cornea</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.cornea_re}</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.cornea_le}</td>
                    </tr>

                    <tr>
                        <td className="font-semibold">Anterior Chamber</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.ac_re}</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.ac_le}</td>
                    </tr>

                    <tr>
                        <td className="font-semibold">Iris</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.iris_re}</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.iris_le}</td>
                    </tr>

                    <tr>
                        <td className="font-semibold">Pupil</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.pupil_re}</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.pupil_le}</td>
                    </tr>

                    </tbody>

                </table>

                </div>

            </div>

            {/* ================= PRESCRIPTION ================= */}
            <div className="grid grid-cols-1 gap-2 mt-0.5 row-span-2" >

                <div className="mt-1 overflow-hidden ">
                
                    <div className="flex items-start mb-0.5">
                        <span className="font-semibold text-xs w-32">
                            Chief Complaint :  
                        </span>
                        <span className="text-[10px] space-y-1">
                            {printData?.chief_complaints?.length > 0 ? (
                                printData.chief_complaints
                                .filter(c => c.complaint)
                                .map((c, i) => (
                                    <p key={i} className="flex items-center py-0.2 text-[10px]">
                                    {c.complaint || "-"} ({c.eye || "-"}) - {c.duration || "-"}
                                    </p>
                                ))
                            ) : (
                                <p>-</p>
                            )}
                        </span>
                    </div>

                    <div className="flex items-start mb-0.5">
                        <span className="font-semibold text-xs w-32">
                            Systemic History :  
                        </span>
                        <span className="text-[10px] space-y-1 ">
                            {printData?.systemic_history?.length > 0 ? (
                                printData.systemic_history
                                    .filter(s => s.disease)
                                    .map((s, i) => (
                                        <p
                                            key={i}
                                            className="flex items-center py-0.2 text-[10px]"
                                        >
                                            {s.disease || "-"} - {s.duration || "-"}
                                            {s.comment ? ` (${s.comment})` : ""}
                                        </p>
                                    ))
                            ) : (
                                <p>-</p>
                            )}
                        </span>
                    </div>


                    {/* Surgical History */}
                    <div className="flex items-start mb-0.5">
                        <span className="font-semibold text-xs w-32">
                            Surgical History :  
                        </span>
                        <span className="text-[10px] space-y-1">{printData?.surgery_history || "Nil"}</span>
                    </div>
                    <div className="flex items-start mb-0.5">
                        <span className="font-semibold text-xs w-40">
                             History of Present Illness :  
                        </span>
                        <span className="text-[10px]">{printData?.history_present_illness || "Nil"}</span>
                    </div>


                    {/* Allergy History */}
                    <div className="flex items-start mb-0.5">
                    <span className="font-semibold text-xs w-32">
                        Allergy History :  
                    </span>
                    <span className="text-[10px] space-y-1">{printData?.allergy_history || "Nil"}</span>
                    </div>
                </div>
               

               
                              

                <div className="mt-1 overflow-hidden ">

                    <div className="flex-2">
                        <div><p className="font-semibold text-xs">Prescription-</p></div>
                        <div className="flex-1 py-2">
                            {printData?.prescriptions
                            ?.filter((p) => p.medicine_id)
                            ?.map((p, index) => (
                                <div
                                key={index}
                                className="flex items-center border-b border-dashed py-0.2 text-[12px]"
                                >
                                <div className="w-10 font-semibold">
                                    {index + 1}.
                                </div>

                                <div className="flex-1 font-semibold">
                                    {getMedicineName(p.medicine_id)}
                                    {p.dosage && ` • ${p.dosage}`}
                                    {p.frequency && ` • ${p.frequency}`}
                                    {p.duration && ` • ${p.duration}`}
                                    {p.instructions && ` • ${p.instructions}`}
                                </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>  


            </div>
            {/* ================= FUNDUS ================= */}



            <div className="border border-slate-400 rounded-md overflow-hidden">

                <div className="bg-[#213c8f] text-white px-3 text-[13px] font-bold uppercase">
                Fundus Examination
                </div>

                <div className="">

                <div className="flex justify-center">

                    <img
                    src={feye}
                    alt="Fundus"
                    className="h-auto w-40"
                    />

                </div>

                <table className="w-full text-[10px]">

                    <tbody>

                    <tr>
                        <td className="font-semibold w-36">Media</td>
                        <td>{printData?.fundus?.be_media_re} | {printData?.fundus?.media_re || "-"}</td>
                        <td>{printData?.fundus?.be_media_le} | {printData?.fundus?.media_le || "-"}</td>
                    </tr>

                    <tr>
                        <td className="font-semibold">Optic Disc</td>
                        <td>{printData?.fundus?.be_optic_re} | {printData?.fundus?.optic_re || "-"}</td>
                        <td>{printData?.fundus?.be_optic_le} | {printData?.fundus?.optic_le || "-"}</td>
                    </tr>

                    <tr>
                        <td className="font-semibold">CDR</td>
                        <td>{printData?.fundus?.cdr_re}</td>
                        <td>{printData?.fundus?.cdr_le}</td>
                    </tr>

                    <tr>
                        <td className="font-semibold">Remarks</td>
                        <td colSpan="2">
                        {printData?.fundus?.comment}
                        </td>
                    </tr>

                    </tbody>

                </table>

                </div>

            </div>

        </div>      
            
        <div>
         <p className="font-semibold mt-1 text-xs">Clinical Impression - {printData?.clinical_impression || ""}</p>

        </div>
        
        {/* ================= ADVICE ================= */}

        <div className="mt-1 overflow-hidden">

           <p className="font-semibold text-xs">Advice- {printData?.advice || ""}</p>
            
          
        </div>


        {/* ================= FOOTER ================= */}

        <div className="grid grid-cols-2 gap-6 mt-1">

            <div>

                <p className="font-semibold text-[12px]">
                    Next Visit
                </p>

                <div className="mt-1 border-b border-black w-56 pb-1 text-[12px]">

                    {printData?.next_visit_date
                        ? new Date(printData.next_visit_date).toLocaleDateString("en-GB")
                        : ""}

                    {printData?.next_visit_reason
                        ? ` (${printData.next_visit_reason})`
                        : ""}    

                </div>

            </div>

            <div className="text-right">

                {/* <div className="h-12"></div> */}

                <div className="border-t border-black inline-block px-6 pt-1">

                    <p className="font-semibold text-[12px]">
                        Authorized Doctor Signature
                    </p>

                    <p className="text-[10px]">
                        S&D Eye Care Centre
                    </p>

                    {/* <p className="text-[10px]">
                        Eye Care Specialist
                    </p> */}

                </div>

            </div>

        </div>     
      
      </div>

    </div>
  );

}