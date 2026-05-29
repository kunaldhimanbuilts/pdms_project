from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.diagnosis import Diagnosis
from app.models.prescription import Prescription
from app.schemas.diagnosis import DiagnosisCreate
from app.models.appointment import Appointment
from app.utils.deps import require_role
from app.utils.deps import require_roles
from app.models.user import User
router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ✅ Save Diagnosis + Prescriptions
@router.post("/")
def create_diagnosis(data: DiagnosisCreate, db: Session = Depends(get_db),user=Depends(require_role("doctor"))):

    diagnosis = Diagnosis(
        patient_id=data.patient_id,
        doctor_id=user["user_id"],
        appointment_id=data.appointment_id,
        diagnosis_text=data.diagnosis_text,
        allergies=data.allergies
    )

    db.add(diagnosis)
    db.commit()
    db.refresh(diagnosis)

    # Save prescriptions
    for item in data.prescriptions:
        prescription = Prescription(
            diagnosis_id=diagnosis.id,
            medicine_name=item.medicine_name,
            type=item.type,
            dosage=item.dosage,
            duration=item.duration,
            instructions=item.instructions
        )
        db.add(prescription)

    db.commit()



    # ✅ Mark appointment as completed
    appointment = db.query(Appointment).filter(
        Appointment.id == data.appointment_id
    ).first()

    if appointment:
        appointment.status = "completed"
        db.commit()

        
    return {"message": "Diagnosis saved successfully"}


# Get full history of patient
@router.get("/patient/{patient_id}")
def patient_history(patient_id: int, db: Session = Depends(get_db), user=Depends(require_roles(["doctor", "compounder"]))):
    # diagnoses = db.query(Diagnosis).filter(
    #     # Diagnosis.patient_id == patient_id
    #     Diagnosis.patient_id == patient_id,
    #     Diagnosis.doctor_id == user["user_id"]
    # ).all()
    if user["role"] == "doctor":
        diagnoses = db.query(Diagnosis).filter(
            Diagnosis.patient_id == patient_id,
            Diagnosis.doctor_id == user["user_id"]
        ).all()
    else:
        diagnoses = db.query(Diagnosis).filter(
            Diagnosis.patient_id == patient_id
        ).all()
    result = []

    for diag in diagnoses:
        prescriptions = db.query(Prescription).filter(
            Prescription.diagnosis_id == diag.id
        ).all()

        # result.append({
        #     "diagnosis": diag,
        #     "prescriptions": prescriptions
        # })
        doctor = db.query(User).filter(User.id == diag.doctor_id).first()

        result.append({
            "diagnosis": diag,
            "doctor_name": doctor.name if doctor else None,  # 🔥 NEW
            "prescriptions": prescriptions
        })
    return result
