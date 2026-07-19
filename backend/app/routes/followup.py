from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.patient import Patient
from app.models.user import User
from app.models.diagnosis_v2 import DiagnosisV2
from datetime import date, timedelta
from app.utils.deps import require_role
from app.models.appointment import Appointment
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(
    prefix="/followups",
    tags=["Follow Up"]
)

@router.get("/")
def get_followups(db: Session = Depends(get_db),user=Depends(require_role("compounder"))):
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    diagnoses = (
        db.query(DiagnosisV2)
        .filter(DiagnosisV2.next_visit_date == tomorrow)
        .all()
    )

    result = []
    
    for diag in diagnoses:

        patient = db.query(Patient).filter(
            Patient.id == diag.patient_id
        ).first()

        doctor = db.query(User).filter(
            User.id == diag.doctor_id
        ).first()
        scheduled = (
            db.query(Appointment)
            .filter(
                Appointment.patient_id == diag.patient_id,
                Appointment.doctor_id == diag.doctor_id,
                Appointment.id != diag.appointment_id,
                Appointment.status == "pending"
            )
            .first()
        )
        result.append({

            "id": diag.appointment_id,

            "patient_id": diag.patient_id,

            "patient_code": patient.patient_code if patient else None,

            "patient_name": patient.name if patient else None,

            "patient_phone": patient.phone if patient else None,

            "doctor_id": diag.doctor_id,

            "doctor_name": doctor.name if doctor else None,

            "next_visit_date": diag.next_visit_date,

            "next_visit_reason": diag.next_visit_reason,


            "scheduled": scheduled is not None,


            "created_at": diag.created_at
            

        })

    return result