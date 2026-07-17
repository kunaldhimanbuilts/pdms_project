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

    const hasValue = (value) => {
    if (value === null || value === undefined) return false;

    if (typeof value === "string")
        return value.trim() !== "";

    return true;
    };

    const hasArray = (arr) => {
    return (
        Array.isArray(arr) &&
        arr.some(item =>
        Object.values(item || {}).some(value => hasValue(value))
        )
    );
    };

    const hasObject = (obj) => {
    return (
        obj &&
        Object.values(obj).some(value => hasValue(value))
    );
    };      
    const showUCVA =
        hasValue(printData?.refraction?.unaided?.re_distance) ||
        hasValue(printData?.refraction?.unaided?.re_near) ||
        hasValue(printData?.refraction?.unaided?.re_pinhole) ||

        hasValue(printData?.refraction?.unaided?.le_distance) ||
        hasValue(printData?.refraction?.unaided?.le_near) ||
        hasValue(printData?.refraction?.unaided?.le_pinhole) ||

        hasValue(printData?.refraction?.unaided?.comment);
    const showPGP =
        hasValue(printData?.refraction?.pgp?.re_sph) ||
        hasValue(printData?.refraction?.pgp?.re_cyl) ||
        hasValue(printData?.refraction?.pgp?.re_axis) ||
        hasValue(printData?.refraction?.pgp?.re_add) ||
        hasValue(printData?.refraction?.pgp?.re_vision_before) ||
        hasValue(printData?.refraction?.pgp?.re_vision_after) ||

        hasValue(printData?.refraction?.pgp?.le_sph) ||
        hasValue(printData?.refraction?.pgp?.le_cyl) ||
        hasValue(printData?.refraction?.pgp?.le_axis) ||
        hasValue(printData?.refraction?.pgp?.le_add) ||
        hasValue(printData?.refraction?.pgp?.le_vision_before) ||
        hasValue(printData?.refraction?.pgp?.le_vision_after) ||

        hasValue(printData?.refraction?.pgp?.comment);
    const showRetinoscopy =
        hasArray(printData?.refraction?.retinoscopy);
    const showFinalRx =
        hasValue(printData?.refraction?.final_refraction?.re_sph) ||
        hasValue(printData?.refraction?.final_refraction?.re_cyl) ||
        hasValue(printData?.refraction?.final_refraction?.re_axis) ||
        hasValue(printData?.refraction?.final_refraction?.re_add) ||
        hasValue(printData?.refraction?.final_refraction?.re_bcva) ||
        hasValue(printData?.refraction?.final_refraction?.re_near_bcva) ||

        hasValue(printData?.refraction?.final_refraction?.le_sph) ||
        hasValue(printData?.refraction?.final_refraction?.le_cyl) ||
        hasValue(printData?.refraction?.final_refraction?.le_axis) ||
        hasValue(printData?.refraction?.final_refraction?.le_add) ||
        hasValue(printData?.refraction?.final_refraction?.le_bcva) ||
        hasValue(printData?.refraction?.final_refraction?.le_near_bcva) ||

        hasValue(printData?.refraction?.final_refraction?.comment);
    const slitLamp = printData?.ocular_exam?.slit_lamp || {};

    const showEyeball =
        hasValue(slitLamp.eyeball_re) ||
        hasValue(slitLamp.eyeball_le);

    const showConjunctiva =
        hasValue(slitLamp.conj_re) ||
        hasValue(slitLamp.conj_le);

    const showSclera =
        hasValue(slitLamp.sclera_re) ||
        hasValue(slitLamp.sclera_le);

    const showCornea =
        hasValue(slitLamp.cornea_re) ||
        hasValue(slitLamp.cornea_le);

    const showAnteriorChamber =
        hasValue(slitLamp.ac_re) ||
        hasValue(slitLamp.ac_le);

    const showIris =
        hasValue(slitLamp.iris_re) ||
        hasValue(slitLamp.iris_le);

    const showPupil =
        hasValue(slitLamp.pupil_re) ||
        hasValue(slitLamp.pupil_le);

    const showCmt =
        hasValue(slitLamp.slit_re_comment) ||
        hasValue(slitLamp.slit_le_comment);
    const showSlitLamp =
        showEyeball ||
        showConjunctiva ||
        showSclera ||
        showCornea ||
        showAnteriorChamber ||
        showIris ||
        showCmt ||
        showPupil;
    const fundus = printData?.fundus || {};

    const showMedia =
        hasValue(fundus.be_media_re) ||
        hasValue(fundus.media_re) ||
        hasValue(fundus.be_media_le) ||
        hasValue(fundus.media_le);

    const showOpticDisc =
        hasValue(fundus.be_optic_re) ||
        hasValue(fundus.optic_re) ||
        hasValue(fundus.be_optic_le) ||
        hasValue(fundus.optic_le);

    const showCDR =
        hasValue(fundus.cdr_re) ||
        hasValue(fundus.cdr_le);

    const showPVD =
        hasValue(fundus.pvd_re) ||
        hasValue(fundus.pvd_le);

    const showOpticSize =
        hasValue(fundus.opticsize_re) ||
        hasValue(fundus.opticsize_le);

    const showFundusRow =
        hasValue(fundus.fundus_re) ||
        hasValue(fundus.fundus_le);

    const showFundus =
        showMedia ||
        showOpticDisc ||
        showCDR ||
        showPVD ||
        showOpticSize ||
        showFundusRow;
    const postDilated = printData?.ocular_exam?.post_dilated_exam || {};

    const showPostDilated =
        hasValue(postDilated.dilated_drop) ||
        hasValue(postDilated.pupil_re_size) ||
        hasValue(postDilated.pupil_le_size) ||
        hasValue(postDilated.pupil_re_reaction) ||
        hasValue(postDilated.pupil_le_reaction) ||
        hasValue(postDilated.lens_re) ||
        hasValue(postDilated.lens_le) ||
        hasValue(postDilated.comment);


    const lacrimal = printData?.ocular_exam?.lacrimal || {};
    const iop = printData?.ocular_exam?.iop || {};
    const schirmer = printData?.ocular_exam?.schirmer || {};
    const colorVision = printData?.ocular_exam?.color_vision || {};

    const showColorVision =
        hasValue(colorVision.re) ||
        hasValue(colorVision.le) ||
        hasValue(colorVision.re_comment) ||
        hasValue(colorVision.le_comment);
    const showSpecialOcular =
        hasValue(lacrimal.re) ||
        hasValue(lacrimal.le) ||
        hasValue(lacrimal.comment) ||

        hasValue(iop.method) ||
        
        hasValue(iop.re) ||
        hasValue(iop.le) ||

        hasValue(schirmer.type) ||
        hasValue(schirmer.time) ||
        hasValue(schirmer.re) ||
        hasValue(schirmer.le) ||
        showColorVision;
    const showLacrimal =
        hasValue(lacrimal.re) ||
        hasValue(lacrimal.le) ||
        hasValue(lacrimal.comment);

    const showIOP =
        hasValue(iop.method) ||
        
        hasValue(iop.re) ||
        hasValue(iop.le);

    const showSchirmer =
        hasValue(schirmer.type) ||
        hasValue(schirmer.time) ||
        hasValue(schirmer.re) ||
        hasValue(schirmer.le);

    const showVisionRefraction =
        showPGP ||
        showFinalRx;
    const diagnosis = printData?.fundus || {};

    const showDiagnosis =
        hasValue(diagnosis.diagnosis_re) ||
        hasValue(diagnosis.diagnosis_le) ||
        hasValue(diagnosis.diagnosis_comment);

  return (
    <div className="print-area">
      <div className="a4-page bg-white relative min-h-[1122px]">

        {/* ================= HEADER ================= */}

        <div className="">

          <div className="flex justify-between items-start px-5 py-0.5">

            {/* LEFT */}

            <div className="flex gap-4">

              {/* LOGO */}

              <img
                src={logo}
                alt="logo"
                className="w-16 h-16 object-contain"
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

        <div className="grid grid-cols-2 gap-4 mt-1">

          {/* Patient */}

          <div className="border rounded-md overflow-hidden ">

            <div className="bg-slate-100 border-b px-3 py-0 font-bold text-[#213c8f] text-[12px] uppercase">
              Patient Details
            </div>

            <div className="px-2 ">

              <div className="grid grid-cols-2 ">

                <div>

                  <span className="font-semibold text-[12px]">
                    Patient ID:
                  </span>

                  <span className="ml-2 text-[12px]">
                    {patient?.patient_code}
                  </span>

                </div>

                <div>

                  <span className="font-semibold text-[12px]">
                    Date:
                  </span>

                  <span className="ml-2 text-[12px]">
                    {today}
                  </span>

                </div>

                <div>

                  <span className="font-semibold text-[12px]">
                    Name:
                  </span>

                  <span className="ml-2 text-[12px]">
                    {patient?.name}
                  </span>

                </div>

                <div>

                  <span className="font-semibold text-[12px]">
                    Age / Sex:
                  </span>

                  <span className="ml-2 text-[12px]">
                    {calculateAge(patient?.dob)} / {patient?.gender}
                  </span>

                </div>

              </div>

              <div className="mt-1 text-[12px]">

                <span className="font-semibold text-[12px]">
                  Address:
                </span>

                <span className="ml-2 text-[12px]">
                  {patient?.address}
                </span>

              </div>

            </div>

          </div>

          {/* Doctor */}

          <div className="border rounded-md overflow-hidden">

            <div className="bg-slate-100 border-b px-3 py-0 font-bold text-[#213c8f] text-[12px] uppercase">
              Clinical Provider
            </div>

            <div className="px-2 ">

              <div>

                <span className="font-semibold text-[12px]">
                  Doctor:
                </span>

                <span className="ml-2 font-bold text-[12px]">
                   (Optom) {doctor?.name || "Doctor"}
                </span>

                <span className="ml-2 text-gray-600 text-[12px]">
                  (B. Optom,M. Optom)
                </span>

              </div>

              <div>

                <span className="font-semibold text-[12px]">
                  Specialty:
                </span>

                <span className="ml-2 text-[12px]">
                  Eye Care Specialist
                </span>

              </div>

              <div>

                <span className="font-semibold text-[12px]">
                  Timings:
                </span>

                <span className="ml-2 text-[12px]">
                  9:00 AM to 7:00 PM
                </span>

                <span className="text-red-600 font-semibold ml-2 text-[12px]">
                  Sunday Closed
                </span>

              </div>

            </div>

          </div>

        </div>
        {/* ================= VISION & REFRACTION ================= */}
        {/* ======================= VISION & REFRACTION MATRIX ======================= */}

        
        <div className="m-2 overflow-hidden ">

            <div className="grid grid-cols-2 gap-2">
                
                    {hasArray(printData?.chief_complaints) && (
                        <div className="flex items-start mb-0.5">
                            <span className="font-semibold text-xs w-36">
                                Chief Complaint :
                            </span>

                            <span className="text-[10px] space-y-1">
                                {printData.chief_complaints
                                    .filter(c => c.complaint)
                                    .map((c, i) => (
                                        <p key={i} className="flex items-center py-0.2 text-[10px]">
                                            • {c.complaint}
                                            {c.eye && ` (${c.eye})`}
                                            {c.duration && ` - ${c.duration}`}
                                            {c.comment && ` (${c.comment})`}
                                        </p>
                                    ))}
                            </span>
                        </div>
                    )}
                    {/* <div className="flex items-start mb-0.5">
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
                    </div> */}
                    {hasArray(printData?.systemic_history) && (
                        <div className="flex items-start mb-0.5">
                            <span className="font-semibold text-xs w-36">
                                Systemic History :
                            </span>

                            <span className="text-[10px] space-y-1">
                                {printData.systemic_history
                                    .filter(s => s.disease)
                                    .map((s, i) => (
                                        <p
                                            key={i}
                                            className="flex items-center py-0.2 text-[10px]"
                                        >
                                            • {s.disease}
                                            {s.duration && ` - ${s.duration}`}
                                            {s.comment && ` (${s.comment})`}
                                        </p>
                                    ))}
                            </span>
                        </div>
                    )}
                
            </div>
            <div className="grid grid-cols-3 gap-2 m-2">

                    {hasValue(printData?.surgery_history) && (
                        <div className="mb-0.5">
                            <p className="font-semibold text-xs ">
                                Surgical History :
                            </p>
                            <div className="text-[10px]">
                                {printData.surgery_history}
                            </div>
                        </div>
                    )}
                    {hasValue(printData?.history_present_illness) && (
                        <div className="mb-0.5">
                            <p className="font-semibold text-xs">
                                History of Present Illness :
                            </p>
                            <div className="text-[10px]">
                                {printData.history_present_illness}
                            </div>
                        </div>
                    )}

                    
                    {hasValue(printData?.allergy_history) && (
                        <div className="mb-0.5">
                            <p className="font-semibold text-xs">
                                Allergy History :
                            </p>
                            <div className="text-[10px]">
                                {printData.allergy_history}
                            </div>
                        </div>
                    )}
                </div>
                    

        </div>

<div className="grid grid-cols-2 gap-2">
        {showUCVA && (
        <div className="mt-1 border border-slate-400 rounded-md overflow-hidden">

            {/* Header */}
            <div className="bg-[#213c8f] text-white font-bold text-[12px] px-3  uppercase tracking-wide">
                Visual Acuity
            </div>

            <table className="w-full border-collapse text-[11px]">

                <thead>

                    <tr className="bg-slate-100">

                        

                        <th className="border border-slate-300 w-12">
                            Eye
                        </th>

                        <th className="border border-slate-300">
                            Distance VA
                        </th>

                        <th className="border border-slate-300">
                            Near VA
                        </th>

                        <th className="border border-slate-300">
                            PH
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {/* ======================= UNAIDED VISUAL ACUITY ======================= */}
                    
                    <>
                    <tr>

                        

                        <td className="border border-slate-300 text-center font-bold text-blue-700">
                            OD
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.unaided?.re_distance || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.unaided?.re_near || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.unaided?.re_pinhole || ""}
                        </td>

                        {/* <td className="border border-slate-300 text-center">
                            {printData?.refraction?.unaided?.comment || ""}
                            D:{printData?.refraction?.unaided?.distance_chart || ""}
                        </td> */}

                    </tr>

                    <tr>

                        <td className="border border-slate-300 text-center font-bold text-red-700">
                            OS
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.unaided?.le_distance || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.unaided?.le_near || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.unaided?.le_pinhole || ""}
                        </td>

                        {/* <td className="border border-slate-300 text-center">
                            N:{printData?.refraction?.unaided?.near_chart || ""}
                        </td> */}

                    </tr>
                    <tr>
                        <td className="border border-slate-300 text-center">
                            Charts
                        </td>
                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.unaided?.distance_chart || ""}
                        </td>
                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.unaided?.near_chart || ""}
                        </td>
                        <td className="border border-slate-300 text-center">
                            
                        </td>
                        
                    </tr>
                    <tr >
                        <td className="border border-slate-300 text-center">
                            Remarks
                        </td>
                        
                        <td colSpan={3} className="border border-slate-300 ">
                            {printData?.refraction?.unaided?.comment || ""}
                        </td>
                    </tr>


                    </>
                    

                </tbody>    

            </table>        

        </div>
        )}
        {showRetinoscopy && (
         <div className="mt-1 border border-slate-400 rounded-md overflow-hidden">

            {/* Header */}
            <div className="bg-[#213c8f] text-white font-bold text-[12px] px-3  uppercase tracking-wide">
                RETINOSCOPY
            </div>

            <table className="w-full border-collapse text-[11px]">

                <thead>

                    <tr className="bg-slate-100">

                        

                        <th className="border border-slate-300 w-12">
                            Eye
                        </th>

                        <th className="border border-slate-300">
                            SPH
                        </th>

                        <th className="border border-slate-300">
                            CYL
                        </th>

                        <th className="border border-slate-300">
                            AXIS
                        </th>
                        <th className="border border-slate-300">
                            GLOW
                        </th>
                        <th className="border border-slate-300">
                            Remarks
                        </th>

                    </tr>

                </thead>

                <tbody>

                    
                        <>
                    {printData?.refraction?.retinoscopy?.map((r, index) => (

                        <React.Fragment key={index}>

                            {/* ---------- OD ---------- */}

                            <tr>

                                
                                <td className="border border-slate-300 text-center font-bold text-blue-700">
                                    OD
                                </td>

                                <td className="border border-slate-300 text-center">
                                    {r.re_sph || ""}
                                </td>

                                <td className="border border-slate-300 text-center">
                                    {r.re_cyl || ""}
                                </td>

                                <td className="border border-slate-300 text-center">
                                    {r.re_axis || ""}
                                </td>

                                <td className="border border-slate-300 text-center">
                                    {r.re_glow || ""}
                                </td>

                               
                                <td className="border border-slate-300 text-center">

                                    {r.type
                                        ? `${r.type} Ret`
                                        : (r.re_glow || "")
                                    }

                                </td>

                            </tr>

                            {/* ---------- OS ---------- */}

                            <tr>

                                <td className="border border-slate-300 text-center font-bold text-red-700">
                                    OS
                                </td>

                                <td className="border border-slate-300 text-center">
                                    {r.le_sph || ""}
                                </td>

                                <td className="border border-slate-300 text-center">
                                    {r.le_cyl || ""}
                                </td>

                                <td className="border border-slate-300 text-center">
                                    {r.le_axis || ""}
                                </td>
                                <td className="border border-slate-300 text-center">
                                    {r.le_glow || ""}
                                </td>

                                
                                <td className="border border-slate-300 text-center">

                                    {r.type
                                        ? `${r.type} Ret`
                                        : (r.le_glow || "")
                                    }

                                </td>

                            </tr>

                        </React.Fragment>

                    ))}
                    </>
                    

                </tbody>    

            </table>        

        </div>
        )}
    </div>
               {showVisionRefraction && ( 
        <div className="mt-1 border border-slate-400 rounded-md overflow-hidden">

            {/* Header */}
            <div className="bg-[#213c8f] text-white font-bold text-[12px] px-3  uppercase tracking-wide">
                Vision & Refraction Matrix
            </div>

            <table className="w-full border-collapse text-[11px]">

                <thead>

                    <tr className="bg-slate-100">

                        <th className="border border-slate-300 px-2 py-1 w-[140px]">
                            Assessment
                        </th>

                        <th className="border border-slate-300 w-12">
                            Eye
                        </th>

                        <th className="border border-slate-300">
                            SPH
                        </th>

                        <th className="border border-slate-300">
                            CYL
                        </th>

                        <th className="border border-slate-300">
                            AXIS
                        </th>

                        <th className="border border-slate-300">
                            ADD
                        </th>

                        <th className="border border-slate-300">
                            Distance VA
                        </th>

                        <th className="border border-slate-300">
                            Near VA
                        </th>

                        <th className="border border-slate-300 w-[190px]">
                            Remarks
                        </th>

                    </tr>

                </thead>

                <tbody>

                   
                    {/* ======================= PRESENT GLASSES ======================= */}
                    {showPGP && (
                    <>
                    <tr>

                        <td
                            rowSpan={2}
                            className="border border-slate-300 px-2 py-2 font-semibold align-top"
                        >
                            Present Glasses (PGP)
                        </td>

                        <td className="border border-slate-300 text-center font-bold text-blue-700">
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
                            {printData?.refraction?.pgp?.re_add || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.pgp?.re_vision_before || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.pgp?.re_vision_after || ""}
                        </td>

                        

                        <td rowSpan={2} className="border border-slate-300 text-center">
                            <p>Comment: {printData?.refraction?.pgp?.comment || ""}</p>
                            <p>Lens: {printData?.refraction?.pgp?.lens_type || "--"}</p>
                        </td>

                    </tr>

                    <tr>

                        <td className="border border-slate-300 text-center font-bold text-red-700">
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
                            {printData?.refraction?.pgp?.le_add || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.pgp?.le_vision_before || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.pgp?.le_vision_after || ""}
                        </td>

                       
                        {/* <td className="border border-slate-300 text-center">
                            
                        </td> */}

                    </tr>

                    </>
                    )}
                    {/* ======================= OBJECTIVE REFRACTION ======================= */}
                    
                    {/* ======================= FINAL SUBJECTIVE REFRACTION ======================= */}
                    {showFinalRx && (
                    <>
                    <tr>

                        <td
                            rowSpan={3}
                            className="border border-slate-300 px-2 py-2 font-semibold align-top"
                        >
                            Final Subjective Rx
                        </td>

                        <td className="border border-slate-300 text-center font-bold text-blue-700">
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
                            {printData?.refraction?.final_refraction?.re_add || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.final_refraction?.re_bcva || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.final_refraction?.re_near_bcva || ""}
                        </td>

                        <td rowSpan={2} className="border border-slate-300 text-center">
                            <p>(at: {printData?.refraction?.final_refraction?.at || ""})</p>
                            <p>Distance Chart- {printData?.refraction?.final_refraction?.chart || ""}</p>
                            <p>Near Chart- {printData?.refraction?.final_refraction?.chart_type || ""}</p>
                        </td>

                        

                    </tr>

                    <tr>

                        <td className="border border-slate-300 text-center font-bold text-red-700">
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
                            {printData?.refraction?.final_refraction?.le_add || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.final_refraction?.le_bcva || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.final_refraction?.le_near_bcva || ""}
                        </td>

                        

                        

                    </tr>
                    <tr>
                        
                        <td colSpan={8} className="border border-slate-300 ">
                            Comment: {printData?.refraction?.final_refraction?.comment || ""}  ||
                            
                            Lens Type- {printData?.refraction?.final_refraction?.lens_pres_type || ""}/
                            Lens Coating- {printData?.refraction?.final_refraction?.lens_pres_coat || ""}
                        </td>
                        
                    </tr>

                    </>
                    )}
                    {/* ======================= FOOTER ======================= */}

                    {/* <tr className="bg-slate-50">

                        <td
                            colSpan={10}
                            className="border border-slate-300 px-3 py-2"
                        >

                            <div className="flex justify-between items-center">

                                <div className="flex gap-8">

                                    <div>

                                        <span className="font-semibold">
                                            Lens :
                                        </span>

                                        {" "}

                                        {printData?.refraction?.pgp?.lens_type || "--"}

                                    </div>

                                    <div>

                                        <span className="font-semibold">
                                            Distance Chart :
                                        </span>

                                        {" "}

                                        {printData?.refraction?.final_refraction?.chart || "--"}

                                    </div>

                                </div>

                                <div>

                                    <span className="font-semibold">
                                        Near Chart :
                                    </span>

                                    {" "}

                                    {printData?.refraction?.final_refraction?.chart_type || "--"}

                                </div>

                            </div>

                        </td>

                    </tr> */}

                </tbody>

            </table>

        </div>
        )}
            
        {/* ================= SLIT LAMP + FUNDUS ================= */}

        <div className="grid grid-cols-2 gap-1 mt-1">

        {/* ================= SLIT LAMP ================= */}
            {showSlitLamp && (
            <div className="border border-slate-400 rounded-md overflow-hidden">

                <div className="bg-[#213c8f] text-[12px] text-white px-3 font-bold uppercase">
                Slit Lamp Examination
                </div>

                <div className="">

                <div className="flex justify-center ">

                    {/* Eye Diagram */}

                    <img
                    src={eye}
                    alt="Eye"
                    className="h-16 object-contain"
                    />

                </div>

                <table className="w-full text-[10px]">

                    <tbody>
                    {showEyeball && (
                    <tr>
                        <td className="font-semibold w-28">Eyeball</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.eyeball_re}</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.eyeball_le}</td>
                    </tr>
                    )}
                    {showConjunctiva && (
                    <tr>
                        <td className="font-semibold">Conjunctiva</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.conj_re}</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.conj_le}</td>
                    </tr>
                    )}
                    {showSclera && (
                    <tr>
                        <td className="font-semibold">Sclera</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.sclera_re}</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.sclera_le}</td>
                    </tr>
                    )}
                    {showCornea && (
                    <tr>
                        <td className="font-semibold">Cornea</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.cornea_re}</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.cornea_le}</td>
                    </tr>
                    )}
                    {showAnteriorChamber && (
                    <tr>
                        <td className="font-semibold">Anterior Chamber</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.ac_re}</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.ac_le}</td>
                    </tr>
                    )}
                    {showIris && (
                    <tr>
                        <td className="font-semibold">Iris</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.iris_re}</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.iris_le}</td>
                    </tr>
                    )}
                    {showPupil && (
                    <tr>
                        <td className="font-semibold">Pupil</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.pupil_re}</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.pupil_le}</td>
                    </tr>
                    )}
                    {showCmt && (
                    <tr>
                        <td className="font-semibold">Comment</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.slit_re_comment}</td>
                        <td>{printData?.ocular_exam?.slit_lamp?.slit_le_comment}</td>
                    </tr>
                    )}
                    </tbody>

                </table>

                </div>

            </div>
            )}
            {/* ================= PRESCRIPTION ================= */}
            
            {/* ================= FUNDUS ================= */}

            {showFundus && (

            <div className="border border-slate-400 rounded-md mt-1 overflow-hidden">

                <div className="bg-[#213c8f] text-white px-3 text-[12px] font-bold uppercase">
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
                    {showMedia && (
                    <tr>
                        <td className="font-semibold w-20">Media</td>
                        <td>{printData?.fundus?.be_media_re || "-"} | {printData?.fundus?.media_re || "-"}</td>
                        <td>{printData?.fundus?.be_media_le || "-"} | {printData?.fundus?.media_le || "-"}</td>
                    </tr>
                    )}
                    {showOpticDisc && (
                    <tr>
                        <td className="font-semibold">Optic Disc</td>
                        <td>{printData?.fundus?.be_optic_re || "-"} | {printData?.fundus?.optic_re || "-"}</td>
                        <td>{printData?.fundus?.be_optic_le || "-"} | {printData?.fundus?.optic_le || "-"}</td>
                    </tr>
                    )}
                    {showCDR && (

                    <tr>
                        <td className="font-semibold">CDR</td>
                        <td>{printData?.fundus?.cdr_re || "-"}</td>
                        <td>{printData?.fundus?.cdr_le || "-"}</td>
                    </tr>
                    )}
                    {showPVD && (
                    <tr>
                        <td className="font-semibold">PVD</td>
                        <td>{printData?.fundus?.pvd_re || "-"}</td>
                        <td>{printData?.fundus?.pvd_le || "-"}</td>
                    </tr>
                    )}
                    {showOpticSize && (
                    <tr>
                        <td className="font-semibold">OPTIC SIZE</td>
                        <td>{printData?.fundus?.opticsize_re || "-"}</td>
                        <td>{printData?.fundus?.opticsize_le || "-"}</td>
                    </tr>
                    )}
                    {showFundusRow && (
                    <tr>
                        <td className="font-semibold">FUNDUS</td>
                        <td>{printData?.fundus?.fundus_re || "-"}</td>
                        <td>{printData?.fundus?.fundus_le || "-"}</td>
                    </tr>
                    )}

                    {/* <tr>
                        <td className="font-semibold">Remarks</td>
                        <td colSpan="2">
                        {printData?.fundus?.comment || "-"}
                        </td>
                    </tr> */}

                    </tbody>

                </table>

                </div>

            </div>
            )}
        </div>      
            
          <div className="grid grid-cols-1 gap-2 mt-1 row-span-2" >   
{showPostDilated && (
<div className="border border-slate-400 rounded-md overflow-hidden  special-ocular">

    <div className="bg-[#213c8f] text-white px-3 font-bold text-[12px] uppercase">
        Post Dilated Examination
    </div>

    <div className="p-1 text-[11px]">

        <p>
            <b>Dilated Drop :</b>{" "}
            {printData?.ocular_exam?.post_dilated_exam?.dilated_drop || "-"}
        </p>

        <table className="w-full mt-2">

            <thead>

                <tr className="border-b">

                    <th></th>

                    <th>RE</th>

                    <th>LE</th>

                </tr>

            </thead>

            <tbody>

                <tr>

                    <td className="font-semibold">
                        Pupil Size
                    </td>

                    <td>
                        {printData?.ocular_exam?.post_dilated_exam?.pupil_re_size || "-"} mm
                    </td>

                    <td>
                        {printData?.ocular_exam?.post_dilated_exam?.pupil_le_size || "-"} mm
                    </td>

                </tr>

                <tr>

                    <td className="font-semibold">
                        Reaction
                    </td>

                    <td>
                        {printData?.ocular_exam?.post_dilated_exam?.pupil_re_reaction || "-"}
                    </td>

                    <td>
                        {printData?.ocular_exam?.post_dilated_exam?.pupil_le_reaction || "-"}
                    </td>

                </tr>

                <tr>

                    <td className="font-semibold">
                        Lens
                    </td>

                    <td>
                        {printData?.ocular_exam?.post_dilated_exam?.lens_re || "-"}
                    </td>

                    <td>
                        {printData?.ocular_exam?.post_dilated_exam?.lens_le || "-"}
                    </td>

                </tr>
            </tbody>

        </table>

        {hasValue(printData?.ocular_exam?.post_dilated_exam?.comment) && (
            <p className="mt-2">
                <b>Comment :</b>{" "}
                {printData.ocular_exam.post_dilated_exam.comment}
            </p>
        )}

    </div>

</div>
)}
{showSpecialOcular && (
<div className="border border-slate-400 rounded-md overflow-hidden special-ocular">

    <div className="bg-[#213c8f] text-white text-[12px] font-bold uppercase px-3">
        Special Ocular Examination
    </div>

    <div className="p-2 text-[11px] space-y-3">

        {/* ================= Lacrimal ================= */}
        {showLacrimal && (
        <div>
            <p className="font-semibold border-b pb-0.5">
                Lacrimal Examination
            </p>

            <table className="w-full mt-1">
                <thead>
                    <tr className="text-center font-semibold">
                        <td></td>
                        <td>RE</td>
                        <td>LE</td>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td className="font-medium w-28">Status</td>
                        <td>{printData?.ocular_exam?.lacrimal?.re || "-"}</td>
                        <td>{printData?.ocular_exam?.lacrimal?.le || "-"}</td>
                    </tr>

                    {hasValue(printData?.ocular_exam?.lacrimal?.comment) && (
                        <tr>
                            <td className="font-medium">Comment</td>
                            <td colSpan={2}>
                                {printData.ocular_exam.lacrimal.comment}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        )}
        {showColorVision && (
        <div>

            <p className="font-semibold border-b pb-0.5">
                Colour Vision
            </p>

            <table className="w-full mt-1">

                <thead>

                    <tr className="text-center font-semibold">

                        <td></td>
                        <td>RE</td>
                        <td>LE</td>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td className="font-medium w-28">
                            Status
                        </td>

                        <td>
                            {colorVision.re || "-"}
                        </td>

                        <td>
                            {colorVision.le || "-"}
                        </td>

                    </tr>

                    {(hasValue(colorVision.re_comment) ||
                    hasValue(colorVision.le_comment)) && (

                    <tr>

                        <td className="font-medium">
                            Comment
                        </td>

                        <td>
                            {colorVision.re_comment || "-"}
                        </td>

                        <td>
                            {colorVision.le_comment || "-"}
                        </td>

                    </tr>

                    )}

                </tbody>

            </table>

        </div>
        )}
        
        {/* ================= IOP ================= */}
        {showIOP && (
        <div>
            <p className="font-semibold border-b pb-0.5">
                Intraocular Pressure (IOP)
            </p>

            <div className="flex justify-between mt-1">

                <span>
                    <b>Method :</b>{" "}
                    {printData?.ocular_exam?.iop?.method || "-"}
                </span>

                <span>
                    <b>Time :</b>{" "}
                    {printData?.ocular_exam?.iop?.time || "-"}
                </span>

            </div>

            <table className="w-full mt-1">

                <thead>

                    <tr className="text-center font-semibold">

                        <td></td>

                        <td>RE</td>

                        <td>LE</td>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td className="font-medium">
                            Pressure
                        </td>

                        <td>
                            {printData?.ocular_exam?.iop?.re || "-"} mmHg
                        </td>

                        <td>
                            {printData?.ocular_exam?.iop?.le || "-"} mmHg
                        </td>

                    </tr>

                </tbody>

            </table>

        </div>
        )}

        {/* ================= Schirmer ================= */}
        {showSchirmer && (
        <div>

            <p className="font-semibold border-b pb-0.5">
                Schirmer Test
            </p>

            <div className="flex justify-between mt-1">

                <span>
                    <b>Type :</b>{" "}
                    {printData?.ocular_exam?.schirmer?.type || "-"}
                </span>

                <span>
                    <b>Time :</b>{" "}
                    {printData?.ocular_exam?.schirmer?.time || "-"}
                </span>

            </div>

            <table className="w-full mt-1">

                <thead>

                    <tr className="text-center font-semibold">

                        <td></td>

                        <td>RE</td>

                        <td>LE</td>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td className="font-medium">
                            Result
                        </td>

                        <td>
                            {printData?.ocular_exam?.schirmer?.re || "-"} mm
                        </td>

                        <td>
                            {printData?.ocular_exam?.schirmer?.le || "-"} mm
                        </td>

                    </tr>

                </tbody>

            </table>

        </div>
        )}
    </div>

</div>
)}
{showDiagnosis && (
<div className="border border-slate-400 rounded-md overflow-hidden special-ocular">

    <div className="bg-[#213c8f] text-white text-[12px] font-bold uppercase px-3">
        Diagnosis
    </div>

    <div className="p-2">

        <table className="w-full text-[11px]">

            <thead>

                <tr className="text-center font-semibold border-b">

                    <th></th>
                    <th>RE</th>
                    <th>LE</th>

                </tr>

            </thead>

            <tbody>

                <tr>

                    <td className="font-semibold w-28">
                        Diagnosis
                    </td>

                    <td>
                        {diagnosis.diagnosis_re || "-"}
                    </td>

                    <td>
                        {diagnosis.diagnosis_le || "-"}
                    </td>

                </tr>

                {hasValue(diagnosis.diagnosis_comment) && (

                <tr>

                    <td className="font-semibold">
                        Comment
                    </td>

                    <td colSpan={2}>
                        {diagnosis.diagnosis_comment}
                    </td>

                </tr>

                )}

            </tbody>

        </table>

    </div>

</div>
)}
                {/* {hasArray(printData?.prescriptions) && (
                    <div className="mt-1 overflow-hidden special-ocular">

                        <div className="flex-2">
                            <div><p className="font-semibold text-xs">Prescription-</p></div>
                            <div className="flex-1 py-2">
                                {printData?.prescriptions
                                ?.filter((p) => p.medicine_name)
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
                                        {p.medicine_name}
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

                )}  */}
{hasArray(printData?.prescriptions) && (
  <div className="mt-1 overflow-hidden special-ocular">
    <div className="flex-2">
      <div>
        <p className="font-semibold text-xs">Prescription-</p>
      </div>

      <div className="flex-1 py-2">
        {printData?.prescriptions
          ?.filter((p) => p.medicine_id || p.medicine_name)
          ?.map((p, index) => (
            <div
              key={index}
              className="flex items-center border-b border-dashed py-0.2 text-[12px]"
            >
              <div className="w-10 font-semibold">
                {index + 1}.
              </div>

              <div className="flex-1 font-semibold">
                {p.medicine_id
                  ? getMedicineName(p.medicine_id)
                  : p.medicine_name}

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
)}
                {/* {hasValue(printData?.clinical_impression) && (
                    <div>
                        <p className="font-semibold mt-1 text-xs">
                            Clinical Impression - {printData.clinical_impression}
                        </p>
                    </div>
                )} */}
                {/* ================= ADVICE ================= */}
                {hasValue(printData?.advice) && (
                    <div className="mt-1 overflow-hidden special-ocular">

                        <p className="font-semibold text-xs w-96">Advice- {printData?.advice || ""}</p>
                        
                    
                    </div>
                )}

               
                {(hasValue(printData?.next_visit_date) ||
                hasValue(printData?.next_visit_reason)) && (
                <div className="mt-3 special-ocular">
                    <p className="font-semibold text-[12px]">Next Visit</p>

                    <div className="mt-1 text-[12px]">
                    {printData?.next_visit_date
                        ? new Date(printData.next_visit_date).toLocaleDateString("en-GB")
                        : ""}

                    {printData?.next_visit_reason
                        ? ` (${printData.next_visit_reason})`
                        : ""}
                    </div>
                </div>
                )}

                
                <div className="absolute bottom-8 right-8 text-right special-ocular">
                    <div className="border-t border-black inline-block px-6 pt-1">
                        <p className="font-semibold text-[10px]">
                            Authorized Doctor Signature
                        </p>
                        <p className="text-[10px]">
                            S&D Eye Care Centre
                        </p>
                    </div>
                </div>
            </div>   
      
      </div>

    </div>
  );

}