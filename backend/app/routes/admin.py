# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session

# from app.database import SessionLocal
# from app.models.patient import Patient
# from app.models.appointment import Appointment
# from app.models.diagnosis import Diagnosis
# from app.models.prescription import Prescription
# from app.utils.deps import require_role
# from sqlalchemy import or_
# from app.models.user import User
# router = APIRouter()


# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# @router.get("/patients/{patient_id}")
# def full_patient_details(patient_id: int, db: Session = Depends(get_db), user=Depends(require_role("admin"))):

#     patient = db.query(Patient).filter(Patient.id == patient_id).first()

#     if not patient:
#         raise HTTPException(status_code=404, detail="Patient not found")

#     # Appointments
#     appointments = db.query(Appointment).filter(
#         Appointment.patient_id == patient_id
#     ).all()

#     # Diagnoses
#     diagnoses = db.query(Diagnosis).filter(
#         Diagnosis.patient_id == patient_id
#     ).all()

#     # Prescriptions
#     result_diagnosis = []

#     for diag in diagnoses:
#         prescriptions = db.query(Prescription).filter(
#             Prescription.diagnosis_id == diag.id
#         ).all()

#         # result_diagnosis.append({
#         #     "diagnosis": diag,
#         #     "prescriptions": prescriptions
#         # })
#         doctor = db.query(User).filter(User.id == diag.doctor_id).first()

#         result_diagnosis.append({
#             "diagnosis": diag,
#             "doctor_name": doctor.name if doctor else None,  # 🔥 NEW
#             "prescriptions": prescriptions
#         })
#     return {
#         "patient": patient,
#         "appointments": appointments,
#         "diagnosis_data": result_diagnosis
#     }




# @router.get("/patients/search/{query}")
# def search_patient(query: str, db: Session = Depends(get_db), user=Depends(require_role("admin"))):

#     patients = db.query(Patient).filter(
#         or_(
#             Patient.patient_code.ilike(f"%{query}%"),
#             Patient.name.ilike(f"%{query}%"),
#             Patient.phone.ilike(f"%{query}%"),
#             Patient.address.ilike(f"%{query}%")
#         )
#     ).all()

#     if not patients:
#         raise HTTPException(status_code=404, detail="Patient not found")

#     return patients
# @router.get("/patients")
# def get_all_patients(user=Depends(require_role("admin")), db: Session = Depends(get_db)):
#     return db.query(Patient).all()


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import SessionLocal
from app.models.patient import Patient
from app.models.appointment import Appointment
from app.models.diagnosis_v2 import DiagnosisV2
from app.models.prescription_v2 import PrescriptionV2
from app.models.user import User

from app.utils.deps import require_role

router = APIRouter()


# ✅ DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ✅ FULL PATIENT DETAILS (V2 ONLY)
@router.get("/patients/{patient_id}")
def full_patient_details(
    patient_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    # 🔹 Get Patient
    patient = db.query(Patient).filter(Patient.id == patient_id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # 🔹 Appointments
    # appointments = db.query(Appointment).filter(
    #     Appointment.patient_id == patient_id
    # ).all()
    appointments_db = db.query(Appointment).filter(
        Appointment.patient_id == patient_id
    ).all()

    appointments = []

    for a in appointments_db:
        doctor = db.query(User).filter(User.id == a.doctor_id).first()

        appointments.append({
            "id": a.id,
            "date": a.date,
            "time": a.time,
            "status": a.status,
            "notes": a.notes,
            "doctor_id": a.doctor_id,
            "doctor_name": doctor.name if doctor else "—"
        })


    # 🔥 Diagnosis V2 ONLY
    diagnoses = db.query(DiagnosisV2).filter(
        DiagnosisV2.patient_id == patient_id
    ).order_by(DiagnosisV2.created_at.desc()).all()

    result = []

    for diag in diagnoses:

        # 🔹 Prescriptions (V2)
        prescriptions = db.query(PrescriptionV2).filter(
            PrescriptionV2.diagnosis_v2_id == diag.id
        ).all()

        # 🔹 Doctor Name
        doctor = db.query(User).filter(User.id == diag.doctor_id).first()

        result.append({
            "diagnosis": diag,
            "doctor_name": doctor.name if doctor else None,
            "prescriptions": prescriptions
        })

    return {
        "patient": patient,
        "appointments": appointments,
        "diagnosis_v2": result   # 🔥 FINAL KEY
    }


# ✅ SEARCH PATIENT
@router.get("/patients/search/{query}")
def search_patient(
    query: str,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    patients = db.query(Patient).filter(
        or_(
            Patient.patient_code.ilike(f"%{query}%"),
            Patient.name.ilike(f"%{query}%"),
            Patient.phone.ilike(f"%{query}%"),
            Patient.address.ilike(f"%{query}%")
        )
    ).all()

    if not patients:
        raise HTTPException(status_code=404, detail="Patient not found")

    return patients


# ✅ GET ALL PATIENTS
@router.get("/patients")
def get_all_patients(
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    return db.query(Patient).all()