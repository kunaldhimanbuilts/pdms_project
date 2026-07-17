export default function HistoryPanel({
    history,
    getMedicineName,
    currentIndex,
    setCurrentIndex,
}) {

    
    return (

            <div className="flex-[1] bg-white rounded-xl shadow flex flex-col h-[120vh] no-print">
            
            <div className="p-1 border-b sticky top-0 bg-white z-10 ">
                <h2 className="text-s font-bold text-blue-900 flex items-center justify-center">
                History Section
                </h2>
            </div>

           

            {/* LEFT SIDE: TITLE + BUTTONS */}
                <div className="flex items-center justify-center gap-10 w-full py-1">
                    <button
                        onClick={() =>
                        setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev))
                        }
                        disabled={currentIndex === 0}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border bg-white shadow-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        &lt;
                    </button>

                    <span className="min-w-[48px] text-center text-sm font-semibold text-gray-600">
                        {history.length > 0 ? `${currentIndex + 1} / ${history.length}` : "0 / 0"}
                    </span>

                    <button
                        onClick={() =>
                        setCurrentIndex(prev =>
                            prev < history.length - 1 ? prev + 1 : prev
                        )
                        }
                        disabled={currentIndex === history.length - 1}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border bg-white shadow-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        &gt;
                    </button>
                </div>
            


            {history.length === 0 && (

                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                <p>📄 No history available</p>
                </div>

                
            )}
            <div className="flex-1 overflow-y-auto p-1">

                {history.length > 0 && (() => {

                    const h = history[currentIndex];

                    return (

                        <div className="p-4 rounded-xl border border-blue-300 bg-blue-50 shadow-sm text-xs space-y-3">

                
                                        
                            <div className="flex justify-between">
                            <p className="font-semibold text-blue-700">
                                {new Date(h.diagnosis.created_at).toLocaleDateString()}
                            </p>
                            <p>{h.doctor_name || "Doctor"}</p>
                            </div>

                            {/* CHIEF COMPLAINT */}
                            <div>
                            <b>C/O:</b>
                            {/* {h.diagnosis.chief_complaints?.map((c,i)=>(
                                <p key={i}>• {c.complaint} ({c.eye}) - {c.duration}</p>
                            ))} */}
                            {h.diagnosis.chief_complaints?.map((c, i) => (
                            <div key={i}>
                                • {c.complaint} ({c.eye}) - {c.duration} ({c.comment})
                                
                            </div>
                            ))}

                            </div>

                            {/* SYSTEMIC */}
                            <div>
                            <b>Systemic:</b>
                            {h.diagnosis.systemic_history?.map((s,i)=>(
                                <p key={i}>• {s.disease} ({s.duration})({s.comment})</p>
                            ))}
                            </div>
                            <div>
                                <b>History of Present Illness:</b>
                                <p>{h.diagnosis.history_present_illness || "—"}</p>
                            </div>
                            <div>
                            <b>Surgery / Laser History:</b>
                            <p>{h.diagnosis.surgery_history || "—"}</p>
                            </div>
                            <div>
                            <b>Allergy History:</b>
                            <p>{h.diagnosis.allergy_history || "—"}</p>
                            </div>
                            {/* ================= REFRACTION ================= */}

                            <div className="space-y-3">

                                <h3 className="font-bold text-blue-700">
                                    REFRACTION
                                </h3>

                                {/* ================= UNAIDED ================= */}
                                {/* ================= COLOUR VISION ================= */}

                                {/* <div className="border rounded-lg p-2">

                                    <p className="font-semibold mb-1">
                                        COLOUR VISION
                                    </p>

                                    <div>

                                        <b>OD</b>

                                        <p>
                                            Status :
                                            {h.diagnosis.ocular_exam?.color_vision?.re || "—"}

                                            {" | "}Comment :
                                            {h.diagnosis.ocular_exam?.color_vision?.re_comment || "—"}
                                        </p>

                                    </div>

                                    <div className="mt-2">

                                        <b>OS</b>

                                        <p>
                                            Status :
                                            {h.diagnosis.ocular_exam?.color_vision?.le || "—"}

                                            {" | "}Comment :
                                            {h.diagnosis.ocular_exam?.color_vision?.le_comment || "—"}
                                        </p>

                                    </div>

                                </div> */}
                                <div className="border rounded-lg p-2">

                                    <p className="font-semibold mb-1">UNAIDED</p>

                                    <div>
                                        <b>OD</b><br />

                                        Distance :
                                        {h.diagnosis.refraction?.unaided?.re_distance || "—"}

                                        {" | "}Pinhole :
                                        {h.diagnosis.refraction?.unaided?.re_pinhole || "—"}

                                        {" | "}Near :
                                        {h.diagnosis.refraction?.unaided?.re_near || "—"}
                                    </div>

                                    <div className="mt-1">

                                        <b>OS</b><br />

                                        Distance :
                                        {h.diagnosis.refraction?.unaided?.le_distance || "—"}

                                        {" | "}Pinhole :
                                        {h.diagnosis.refraction?.unaided?.le_pinhole || "—"}

                                        {" | "}Near :
                                        {h.diagnosis.refraction?.unaided?.le_near || "—"}

                                    </div>

                                    <div className="mt-1">
                                        Distance Chart :
                                        {h.diagnosis.refraction?.unaided?.distance_chart || "—"}
                                    </div>

                                    <div>
                                        Near Chart :
                                        {h.diagnosis.refraction?.unaided?.near_chart || "—"}
                                    </div>

                                    <div>
                                        Comment :
                                        {h.diagnosis.refraction?.unaided?.comment || "—"}
                                    </div>

                                </div>


                                {/* ================= PGP ================= */}

                                <div className="border rounded-lg p-2">

                                    <p className="font-semibold mb-1">
                                        PGP
                                    </p>

                                    <div>

                                        <b>OD</b>

                                        <p>
                                            SPH :
                                            {h.diagnosis.refraction?.pgp?.re_sph || "—"}

                                            {" | "}CYL :
                                            {h.diagnosis.refraction?.pgp?.re_cyl || "—"}

                                            {" | "}AXIS :
                                            {h.diagnosis.refraction?.pgp?.re_axis || "—"}
                                        </p>

                                        <p>
                                            Distance :
                                            {h.diagnosis.refraction?.pgp?.re_vision_before || "—"}

                                            {" | "}ADD :
                                            {h.diagnosis.refraction?.pgp?.re_add || "—"}

                                            {" | "}Near :
                                            {h.diagnosis.refraction?.pgp?.re_vision_after || "—"}
                                        </p>

                                    </div>

                                    <div className="mt-2">

                                        <b>OS</b>

                                        <p>
                                            SPH :
                                            {h.diagnosis.refraction?.pgp?.le_sph || "—"}

                                            {" | "}CYL :
                                            {h.diagnosis.refraction?.pgp?.le_cyl || "—"}

                                            {" | "}AXIS :
                                            {h.diagnosis.refraction?.pgp?.le_axis || "—"}
                                        </p>

                                        <p>
                                            Distance :
                                            {h.diagnosis.refraction?.pgp?.le_vision_before || "—"}

                                            {" | "}ADD :
                                            {h.diagnosis.refraction?.pgp?.le_add || "—"}

                                            {" | "}Near :
                                            {h.diagnosis.refraction?.pgp?.le_vision_after || "—"}
                                        </p>

                                    </div>

                                    <div className="mt-1">
                                        Lens :
                                        {h.diagnosis.refraction?.pgp?.lens_type || "—"}
                                    </div>

                                    <div>
                                        Comment :
                                        {h.diagnosis.refraction?.pgp?.comment || "—"}
                                    </div>

                                </div>


                                {/* ================= RETINOSCOPY ================= */}

                                {h.diagnosis.refraction?.retinoscopy?.map((r, index) => (

                                    <div
                                        key={index}
                                        className="border rounded-lg p-2"
                                    >

                                        <p className="font-semibold">
                                            Retinoscopy #{index + 1}
                                        </p>

                                        <p>
                                            Type :
                                            {r.type || "—"}
                                        </p>

                                        <div>

                                            <b>OD</b>

                                            <p>
                                                SPH : {r.re_sph || "—"}

                                                {" | "}CYL : {r.re_cyl || "—"}

                                                {" | "}AXIS : {r.re_axis || "—"}

                                                {" | "}Glow : {r.re_glow || "—"}
                                            </p>

                                        </div>

                                        <div>

                                            <b>OS</b>

                                            <p>
                                                SPH : {r.le_sph || "—"}

                                                {" | "}CYL : {r.le_cyl || "—"}

                                                {" | "}AXIS : {r.le_axis || "—"}

                                                {" | "}Glow : {r.le_glow || "—"}
                                            </p>

                                        </div>

                                    </div>

                                ))}


                                {/* ================= FINAL REFRACTION ================= */}

                                <div className="border rounded-lg p-2">

                                    <p className="font-semibold">
                                        FINAL REFRACTION
                                    </p>

                                    <div>

                                        <b>OD</b>

                                        <p>
                                            SPH : {h.diagnosis.refraction?.final_refraction?.re_sph || "—"}

                                            {" | "}CYL : {h.diagnosis.refraction?.final_refraction?.re_cyl || "—"}

                                            {" | "}AXIS : {h.diagnosis.refraction?.final_refraction?.re_axis || "—"}
                                        </p>

                                        <p>
                                            Distance BCVA :
                                            {h.diagnosis.refraction?.final_refraction?.re_bcva || "—"}

                                            {" | "}ADD :
                                            {h.diagnosis.refraction?.final_refraction?.re_add || "—"}

                                            {" | "}Near BCVA :
                                            {h.diagnosis.refraction?.final_refraction?.re_near_bcva || "—"}
                                        </p>

                                    </div>

                                    <div className="mt-2">

                                        <b>OS</b>

                                        <p>
                                            SPH : {h.diagnosis.refraction?.final_refraction?.le_sph || "—"}

                                            {" | "}CYL : {h.diagnosis.refraction?.final_refraction?.le_cyl || "—"}

                                            {" | "}AXIS : {h.diagnosis.refraction?.final_refraction?.le_axis || "—"}
                                        </p>

                                        <p>
                                            Distance BCVA :
                                            {h.diagnosis.refraction?.final_refraction?.le_bcva || "—"}

                                            {" | "}ADD :
                                            {h.diagnosis.refraction?.final_refraction?.le_add || "—"}

                                            {" | "}Near BCVA :
                                            {h.diagnosis.refraction?.final_refraction?.le_near_bcva || "—"}
                                        </p>

                                    </div>

                                    <div className="mt-1">
                                        Distance Chart :
                                        {h.diagnosis.refraction?.final_refraction?.chart || "—"}
                                    </div>

                                    <div>
                                        Near Chart :
                                        {h.diagnosis.refraction?.final_refraction?.chart_type || "—"}
                                    </div>

                                    <div>
                                        At :
                                        {h.diagnosis.refraction?.final_refraction?.at || "—"}
                                    </div>

                                    <div>
                                        Comment :
                                        {h.diagnosis.refraction?.final_refraction?.comment || "—"}
                                    </div>
                                    <div>
                                        Lens type :
                                        {h.diagnosis.refraction?.final_refraction?.lens_pres_type || "—"}
                                    </div>
                                    <div>
                                        Lens Coating :
                                        {h.diagnosis.refraction?.final_refraction?.lens_pres_coat || "—"}
                                    </div>


                                </div>

                            </div>

                            {/* ================= OCULAR EXAMINATION ================= */}

                            <div className="space-y-3">

                                <h3 className="font-bold text-blue-700">
                                    OCULAR EXAMINATION
                                </h3>

                                {/* ================= OCULAR MOTILITY ================= */}

                                <div className="border rounded-lg p-2">

                                    <p className="font-semibold">
                                        Ocular Motility
                                    </p>

                                    <p>
                                        OD : {h.diagnosis.ocular_exam?.motility?.re || "—"}
                                    </p>

                                    <p>
                                        OS : {h.diagnosis.ocular_exam?.motility?.le || "—"}
                                    </p>

                                </div>


                                {/* ================= SLIT LAMP ================= */}

                                <div className="border rounded-lg p-2">

                                    <p className="font-semibold">
                                        Slit Lamp Examination
                                    </p>

                                    <table className="w-full text-xs mt-2 border">

                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>OD</th>
                                                <th>OS</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            <tr>
                                                <td>Lid</td>
                                                <td>{h.diagnosis.ocular_exam?.slit_lamp?.eyeball_re || "—"}</td>
                                                <td>{h.diagnosis.ocular_exam?.slit_lamp?.eyeball_le || "—"}</td>
                                            </tr>

                                            <tr>
                                                <td>Conjunctiva</td>
                                                <td>{h.diagnosis.ocular_exam?.slit_lamp?.conj_re || "—"}</td>
                                                <td>{h.diagnosis.ocular_exam?.slit_lamp?.conj_le || "—"}</td>
                                            </tr>

                                            <tr>
                                                <td>Sclera</td>
                                                <td>{h.diagnosis.ocular_exam?.slit_lamp?.sclera_re || "—"}</td>
                                                <td>{h.diagnosis.ocular_exam?.slit_lamp?.sclera_le || "—"}</td>
                                            </tr>

                                            <tr>
                                                <td>Cornea</td>
                                                <td>{h.diagnosis.ocular_exam?.slit_lamp?.cornea_re || "—"}</td>
                                                <td>{h.diagnosis.ocular_exam?.slit_lamp?.cornea_le || "—"}</td>
                                            </tr>

                                            <tr>
                                                <td>Anterior Chamber</td>
                                                <td>{h.diagnosis.ocular_exam?.slit_lamp?.ac_re || "—"}</td>
                                                <td>{h.diagnosis.ocular_exam?.slit_lamp?.ac_le || "—"}</td>
                                            </tr>

                                            <tr>
                                                <td>Iris</td>
                                                <td>{h.diagnosis.ocular_exam?.slit_lamp?.iris_re || "—"}</td>
                                                <td>{h.diagnosis.ocular_exam?.slit_lamp?.iris_le || "—"}</td>
                                            </tr>

                                            <tr>
                                                <td>Pupil</td>
                                                <td>{h.diagnosis.ocular_exam?.slit_lamp?.pupil_re || "—"}</td>
                                                <td>{h.diagnosis.ocular_exam?.slit_lamp?.pupil_le || "—"}</td>
                                            </tr>

                                        </tbody>

                                    </table>

                                    <div className="mt-2">
                                        <b>OD Comment :</b>{" "}
                                        {h.diagnosis.ocular_exam?.slit_lamp?.slit_re_comment || "—"}
                                    </div>

                                    <div>
                                        <b>OS Comment :</b>{" "}
                                        {h.diagnosis.ocular_exam?.slit_lamp?.slit_le_comment || "—"}
                                    </div>

                                </div>


                                {/* ================= IOP ================= */}

                                <div className="border rounded-lg p-2">

                                    <p className="font-semibold">
                                        IOP
                                    </p>

                                    <p>
                                        Method :
                                        {h.diagnosis.ocular_exam?.iop?.method || "—"}
                                    </p>

                                    <p>
                                        OD :
                                        {h.diagnosis.ocular_exam?.iop?.re || "—"}
                                    </p>

                                    <p>
                                        OS :
                                        {h.diagnosis.ocular_exam?.iop?.le || "—"}
                                    </p>

                                    <p>
                                        Time :
                                        {h.diagnosis.ocular_exam?.iop?.time || "—"}
                                    </p>

                                </div>


                                {/* ================= LACRIMAL ================= */}

                                <div className="border rounded-lg p-2">

                                    <p className="font-semibold">
                                        Lacrimal Patency
                                    </p>

                                    <p>
                                        OD :
                                        {h.diagnosis.ocular_exam?.lacrimal?.re || "—"}
                                    </p>

                                    <p>
                                        OS :
                                        {h.diagnosis.ocular_exam?.lacrimal?.le || "—"}
                                    </p>

                                    <p>
                                        Comment :
                                        {h.diagnosis.ocular_exam?.lacrimal?.comment || "—"}
                                    </p>

                                </div>


                                {/* ================= SCHIRMER ================= */}

                                <div className="border rounded-lg p-2">

                                    <p className="font-semibold">
                                        Schirmer Test
                                    </p>

                                    <p>
                                        Type :
                                        {h.diagnosis.ocular_exam?.schirmer?.type || "—"}
                                    </p>

                                    <p>
                                        Time :
                                        {h.diagnosis.ocular_exam?.schirmer?.time || "—"}
                                    </p>

                                    <p>
                                        OD :
                                        {h.diagnosis.ocular_exam?.schirmer?.re || "—"} mm
                                    </p>

                                    <p>
                                        OS :
                                        {h.diagnosis.ocular_exam?.schirmer?.le || "—"} mm
                                    </p>

                                </div>


                                {/* ================= COLOUR VISION ================= */}

                                <div className="border rounded-lg p-2">

                                    <p className="font-semibold">
                                        Colour Vision
                                    </p>

                                    <p>
                                        OD :
                                        {h.diagnosis.ocular_exam?.color_vision?.re || "—"}

                                        {" | "}Comment :
                                        {h.diagnosis.ocular_exam?.color_vision?.re_comment || "—"}
                                    </p>

                                    <p>
                                        OS :
                                        {h.diagnosis.ocular_exam?.color_vision?.le || "—"}

                                        {" | "}Comment :
                                        {h.diagnosis.ocular_exam?.color_vision?.le_comment || "—"}
                                    </p>

                                </div>

                            </div>

                            {/* ================= POST DILATED EXAMINATION ================= */}

                            <div className="space-y-3">

                                <h3 className="font-bold text-blue-700">
                                    POST DILATED EXAMINATION
                                </h3>

                                <div className="border rounded-lg p-2">

                                    <p>
                                        <b>Dilated Drop :</b>{" "}
                                        {h.diagnosis.ocular_exam?.post_dilated_exam?.dilated_drop || "—"}
                                    </p>

                                    <table className="w-full text-xs mt-2 border">

                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>OD</th>
                                                <th>OS</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            <tr>
                                                <td>Pupil Size</td>
                                                <td>{h.diagnosis.ocular_exam?.post_dilated_exam?.pupil_re_size || "—"}</td>
                                                <td>{h.diagnosis.ocular_exam?.post_dilated_exam?.pupil_le_size || "—"}</td>
                                            </tr>

                                            <tr>
                                                <td>Reaction</td>
                                                <td>{h.diagnosis.ocular_exam?.post_dilated_exam?.pupil_re_reaction || "—"}</td>
                                                <td>{h.diagnosis.ocular_exam?.post_dilated_exam?.pupil_le_reaction || "—"}</td>
                                            </tr>

                                            <tr>
                                                <td>Lens</td>
                                                <td>{h.diagnosis.ocular_exam?.post_dilated_exam?.lens_re || "—"}</td>
                                                <td>{h.diagnosis.ocular_exam?.post_dilated_exam?.lens_le || "—"}</td>
                                            </tr>

                                        </tbody>

                                    </table>

                                    <p className="mt-2">
                                        <b>Comment :</b>{" "}
                                        {h.diagnosis.ocular_exam?.post_dilated_exam?.comment || "—"}
                                    </p>

                                </div>

                            </div>


                            {/* ================= FUNDUS ================= */}

                            <div className="space-y-3">

                                <h3 className="font-bold text-blue-700">
                                    FUNDUS
                                </h3>

                                <table className="w-full text-xs border">

                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>OD</th>
                                            <th>OS</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        <tr>
                                            <td>Media</td>
                                            <td>
                                                {h.diagnosis.fundus?.be_media_re || "—"}
                                                {h.diagnosis.fundus?.media_re &&
                                                    ` (${h.diagnosis.fundus.media_re})`}
                                            </td>
                                            <td>
                                                {h.diagnosis.fundus?.be_media_le || "—"}
                                                {h.diagnosis.fundus?.media_le &&
                                                    ` (${h.diagnosis.fundus.media_le})`}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>PVD</td>
                                            <td>{h.diagnosis.fundus?.pvd_re || "—"}</td>
                                            <td>{h.diagnosis.fundus?.pvd_le || "—"}</td>
                                        </tr>

                                        <tr>
                                            <td>Disc Size</td>
                                            <td>{h.diagnosis.fundus?.opticsize_re || "—"}</td>
                                            <td>{h.diagnosis.fundus?.opticsize_le || "—"}</td>
                                        </tr>

                                        <tr>
                                            <td>CDR</td>
                                            <td>{h.diagnosis.fundus?.cdr_re || "—"}</td>
                                            <td>{h.diagnosis.fundus?.cdr_le || "—"}</td>
                                        </tr>

                                        <tr>
                                            <td>Optic Disc</td>
                                            <td>
                                                {h.diagnosis.fundus?.be_optic_re || "—"}
                                                {h.diagnosis.fundus?.optic_re &&
                                                    ` (${h.diagnosis.fundus.optic_re})`}
                                            </td>
                                            <td>
                                                {h.diagnosis.fundus?.be_optic_le || "—"}
                                                {h.diagnosis.fundus?.optic_le &&
                                                    ` (${h.diagnosis.fundus.optic_le})`}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>Fundus</td>
                                            <td>{h.diagnosis.fundus?.fundus_re || "—"}</td>
                                            <td>{h.diagnosis.fundus?.fundus_le || "—"}</td>
                                        </tr>

                                    </tbody>

                                </table>

                            </div>


                            {/* ================= DIAGNOSIS ================= */}

                            <div className="border rounded-lg p-2">

                                <h3 className="font-bold text-blue-700 mb-2">
                                    DIAGNOSIS
                                </h3>

                                <p>
                                    <b>OD :</b>{" "}
                                    {h.diagnosis.fundus?.diagnosis_re || "—"}
                                </p>

                                <p>
                                    <b>OS :</b>{" "}
                                    {h.diagnosis.fundus?.diagnosis_le || "—"}
                                </p>

                                <p className="mt-2">
                                    <b>Comment :</b>{" "}
                                    {h.diagnosis.fundus?.diagnosis_comment || "—"}
                                </p>

                            </div>

                            {/* CLINICAL */}
                            <div>
                            <b>Clinical:</b> {h.diagnosis.clinical_impression}
                            </div>

                            {/* ADVICE */}
                            <div>
                            <b>Advice:</b> {h.diagnosis.advice}
                            </div>

                            {/* PRESCRIPTION */}
                            <div>
                            <b>Rx:</b>
                            {h.prescriptions?.map((p,i)=>(
                                <p key={i}>
                                • {p.medicine_name || getMedicineName(p.medicine_id)} | {p.dosage} | {p.duration} | {p.instructions}
                                </p>
                            ))}
                            </div>

                            {/* NEXT VISIT */}
                            {h.diagnosis.next_visit_date && (
                            <div className="text-blue-600">
                                Next: {h.diagnosis.next_visit_date} ({h.diagnosis.next_visit_reason})
                            </div>
                            )}
                        </div>

                    );

                })()}

            </div>
        </div>

        
    );
}