from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.diagnosis_v2 import DiagnosisV2
from app.models.prescription_v2 import PrescriptionV2
from app.models.appointment import Appointment
from app.models.user import User
from app.schemas.diagnosis_v2 import DiagnosisV2Create
from app.utils.deps import require_role, require_roles

router = APIRouter()


# DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🔥 CREATE DIAGNOSIS V2
@router.post("/")
def create_diagnosis_v2(
    data: DiagnosisV2Create,
    db: Session = Depends(get_db),
    user=Depends(require_role("doctor"))
):

    # ✅ STRICT CHECK
    appointment = db.query(Appointment).filter(
        Appointment.id == data.appointment_id
    ).first()

    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    if appointment.status != "pending":
        raise HTTPException(status_code=400, detail="Appointment already completed")

    # ✅ CREATE MAIN DIAGNOSIS
    diagnosis = DiagnosisV2(
        patient_id=data.patient_id,
        doctor_id=user["user_id"],
        appointment_id=data.appointment_id,

        chief_complaints=data.chief_complaints,
        systemic_history=data.systemic_history,

        history_present_illness=data.history_present_illness,
        surgery_history=data.surgery_history,
        allergy_history=data.allergy_history,

        refraction=data.refraction,
        ocular_exam=data.ocular_exam,
        fundus=data.fundus,

        clinical_impression=data.clinical_impression,
        advice=data.advice,

        next_visit_date=data.next_visit_date,
        next_visit_reason=data.next_visit_reason
    )

    db.add(diagnosis)
    db.commit()
    db.refresh(diagnosis)

    # ✅ SAVE PRESCRIPTIONS
    for item in data.prescriptions:
        pres = PrescriptionV2(
            diagnosis_v2_id=diagnosis.id,
            medicine_id=item.medicine_id,
            dosage=item.dosage,
            duration=item.duration,
            instructions=item.instructions,
            type=item.type 
        )
        db.add(pres)

    db.commit()

    # ✅ MARK APPOINTMENT COMPLETED
    appointment.status = "completed"
    db.commit()

    return {"message": "Diagnosis V2 saved successfully"}



@router.get("/patient/{patient_id}")
def get_history_v2(
    patient_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["doctor", "compounder"]))
):

    diagnoses = db.query(DiagnosisV2).filter(
        DiagnosisV2.patient_id == patient_id
    ).all()

    result = []

    for diag in diagnoses:

        prescriptions = db.query(PrescriptionV2).filter(
            PrescriptionV2.diagnosis_v2_id == diag.id
        ).all()

        doctor = db.query(User).filter(User.id == diag.doctor_id).first()

        result.append({
            "diagnosis": diag,
            "doctor_name": doctor.name if doctor else None,
            "prescriptions": prescriptions
        })

    return result