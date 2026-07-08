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

    const showSlitLamp =
        showEyeball ||
        showConjunctiva ||
        showSclera ||
        showCornea ||
        showAnteriorChamber ||
        showIris ||
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

        <div className="grid grid-cols-2 gap-5 mt-0.5">

          {/* Patient */}

          <div className="border rounded-md overflow-hidden ">

            <div className="bg-slate-100 border-b px-3 py-0 font-bold text-[#213c8f] text-[12px] uppercase">
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

            <div className="bg-slate-100 border-b px-3 py-0 font-bold text-[#213c8f] text-[12px] uppercase">
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
        {/* ======================= VISION & REFRACTION MATRIX ======================= */}

        <div className="mt-0.5 border border-slate-400 rounded-md overflow-hidden"
        
        >

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

                        <th className="border border-slate-300">
                            PH
                        </th>

                        <th className="border border-slate-300 w-[190px]">
                            Remarks
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {/* ======================= UNAIDED VISUAL ACUITY ======================= */}
                    {showUCVA && (
                    <>
                    <tr>

                        <td
                            rowSpan={2}
                            className="border border-slate-300 px-2 py-2 font-semibold align-top"
                        >
                            Unaided Visual Acuity (UCVA)
                        </td>

                        <td className="border border-slate-300 text-center font-bold text-blue-700">
                            OD
                        </td>

                        <td className="border border-slate-300 text-center">—</td>

                        <td className="border border-slate-300 text-center">—</td>

                        <td className="border border-slate-300 text-center">—</td>

                        <td className="border border-slate-300 text-center">—</td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.unaided?.re_distance || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.unaided?.re_near || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.unaided?.re_pinhole || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {/* {printData?.refraction?.unaided?.comment || ""} */}
                            D:{printData?.refraction?.unaided?.distance_chart || ""}
                        </td>

                    </tr>

                    <tr>

                        <td className="border border-slate-300 text-center font-bold text-red-700">
                            OS
                        </td>

                        <td className="border border-slate-300 text-center">—</td>

                        <td className="border border-slate-300 text-center">—</td>

                        <td className="border border-slate-300 text-center">—</td>

                        <td className="border border-slate-300 text-center">—</td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.unaided?.le_distance || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.unaided?.le_near || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.unaided?.le_pinhole || ""}
                        </td>

                        <td className="border border-slate-300 text-center">
                            N:{printData?.refraction?.unaided?.near_chart || ""}
                        </td>

                    </tr>

                    </>
                    )}
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

                        <td className="border border-slate-300 text-center">
                            —
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.pgp?.comment || ""}
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

                        <td className="border border-slate-300 text-center">
                            —
                        </td>

                        <td className="border border-slate-300 text-center">
                            Lens: {printData?.refraction?.pgp?.lens_type || "--"}
                        </td>

                    </tr>

                    </>
                    )}
                    {/* ======================= OBJECTIVE REFRACTION ======================= */}
                    {showRetinoscopy && (
                        <>
                    {printData?.refraction?.retinoscopy?.map((r, index) => (

                        <React.Fragment key={index}>

                            {/* ---------- OD ---------- */}

                            <tr>

                                {index === 0 && (

                                    <td
                                        rowSpan={printData.refraction.retinoscopy.length * 2}
                                        className="border border-slate-300 px-2 py-2 font-semibold align-top"
                                    >
                                        Objective Refraction
                                        <br />
                                        <span className="text-[10px] font-normal">
                                            (AR / Retinoscopy)
                                        </span>
                                    </td>

                                )}

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
                                    —
                                </td>

                                <td className="border border-slate-300 text-center">
                                    —
                                </td>

                                <td className="border border-slate-300 text-center">
                                    —
                                </td>

                                <td className="border border-slate-300 text-center">
                                    —
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
                                    —
                                </td>

                                <td className="border border-slate-300 text-center">
                                    —
                                </td>

                                <td className="border border-slate-300 text-center">
                                    —
                                </td>

                                <td className="border border-slate-300 text-center">
                                    —
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
                    )}
                    {/* ======================= FINAL SUBJECTIVE REFRACTION ======================= */}
                    {showFinalRx && (
                    <>
                    <tr>

                        <td
                            rowSpan={2}
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

                        <td className="border border-slate-300 text-center">
                            —
                        </td>

                        <td className="border border-slate-300 text-center">
                            {printData?.refraction?.final_refraction?.comment || ""}
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

                        <td className="border border-slate-300 text-center">
                            —
                        </td>

                        <td className="border border-slate-300 text-center">
                            (at: {printData?.refraction?.final_refraction?.at || ""})
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
            
        {/* ================= SLIT LAMP + FUNDUS ================= */}

        <div className="grid grid-cols-2 gap-1 mt-0.5">

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
                    </tbody>

                </table>

                </div>

            </div>
            )}
            {/* ================= PRESCRIPTION ================= */}
            <div className="grid grid-cols-1 gap-2 mt-0.5 row-span-2" >

                <div className="mt-1 overflow-hidden ">
                
                    {/* <div className="flex items-start mb-0.5">
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
                    </div> */}
                    {hasArray(printData?.chief_complaints) && (
                        <div className="flex items-start mb-0.5">
                            <span className="font-semibold text-xs w-32">
                                Chief Complaint :
                            </span>

                            <span className="text-[10px] space-y-1">
                                {printData.chief_complaints
                                    .filter(c => c.complaint)
                                    .map((c, i) => (
                                        <p key={i} className="flex items-center py-0.2 text-[10px]">
                                            {c.complaint}
                                            {c.eye && ` (${c.eye})`}
                                            {c.duration && ` - ${c.duration}`}
                                            {/* {c.comment && ` (${c.comment})`} */}
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
                            <span className="font-semibold text-xs w-32">
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
                                            {s.disease}
                                            {s.duration && ` - ${s.duration}`}
                                            {s.comment && ` (${s.comment})`}
                                        </p>
                                    ))}
                            </span>
                        </div>
                    )}

                    {/* Surgical History */}
                    {/* <div className="flex items-start mb-0.5">
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
                    </div> */}
                    {hasValue(printData?.surgery_history) && (
                        <div className="flex items-start mb-0.5">
                            <span className="font-semibold text-xs w-32">
                                Surgical History :
                            </span>
                            <span className="text-[10px]">
                                {printData.surgery_history}
                            </span>
                        </div>
                    )}
                    {hasValue(printData?.history_present_illness) && (
                        <div className="flex items-start mb-0.5">
                            <span className="font-semibold text-xs w-40">
                                History of Present Illness :
                            </span>
                            <span className="text-[10px]">
                                {printData.history_present_illness}
                            </span>
                        </div>
                    )}

                    {/* Allergy History */}
                    {/* <div className="flex items-start mb-0.5">
                        <span className="font-semibold text-xs w-32">
                            Allergy History :  
                        </span>
                        <span className="text-[10px] space-y-1">{printData?.allergy_history || "Nil"}</span>
                    </div> */}
                    {hasValue(printData?.allergy_history) && (
                        <div className="flex items-start mb-0.5">
                            <span className="font-semibold text-xs w-32">
                                Allergy History :
                            </span>
                            <span className="text-[10px]">
                                {printData.allergy_history}
                            </span>
                        </div>
                    )}

                </div>
               

               
                              
                {hasArray(printData?.prescriptions) && (
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

                )} 
                {/* <div>
                <p className="font-semibold mt-1 text-xs">Clinical Impression - {printData?.clinical_impression || ""}</p>

                </div> */}
                {hasValue(printData?.clinical_impression) && (
                    <div>
                        <p className="font-semibold mt-1 text-xs">
                            Clinical Impression - {printData.clinical_impression}
                        </p>
                    </div>
                )}
                {/* ================= ADVICE ================= */}
                {hasValue(printData?.advice) && (
                    <div className="mt-1 overflow-hidden">

                        <p className="font-semibold text-xs">Advice- {printData?.advice || ""}</p>
                        
                    
                    </div>
                )}

                {/* ================= FOOTER ================= */}

                <div className="grid grid-cols-2 gap-6 mt-1">
                    {(hasValue(printData?.next_visit_date) ||
                    hasValue(printData?.next_visit_reason)) && (
                        <div>

                            <p className="font-semibold text-[12px]">
                                Next Visit
                            </p>

                            {/* <div className="mt-1 border-b border-black w-56 pb-1 text-[12px]"> */}
                            <div className="mt-1 w-56 pb-1 text-[12px]">

                                {printData?.next_visit_date
                                    ? new Date(printData.next_visit_date).toLocaleDateString("en-GB")
                                    : ""}

                                {printData?.next_visit_reason
                                    ? ` (${printData.next_visit_reason})`
                                    : ""}    

                            </div>

                        </div>
                    )}
                    <div className="text-right">

                        {/* <div className="h-12"></div> */}

                        <div className="border-t border-black inline-block px-6 pt-1">

                            <p className="font-semibold text-[10px]">
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
            {/* ================= FUNDUS ================= */}

            {showFundus && (

            <div className="border border-slate-400 rounded-md mt-0.5 overflow-hidden">

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
            
             
      
      </div>

    </div>
  );

}