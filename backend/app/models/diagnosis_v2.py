from sqlalchemy import Column, Integer, ForeignKey, DateTime, String
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from app.database import Base

class DiagnosisV2(Base):
    __tablename__ = "diagnosis_v2"

    id = Column(Integer, primary_key=True, index=True)

    patient_id = Column(Integer, ForeignKey("patients.id"))
    doctor_id = Column(Integer, ForeignKey("users.id"))
    appointment_id = Column(Integer, ForeignKey("appointments.id"))

    # 🔥 STRUCTURED DATA
    chief_complaints = Column(JSONB)
    systemic_history = Column(JSONB)

    history_present_illness = Column(String)
    surgery_history = Column(String)
    allergy_history = Column(String)

    refraction = Column(JSONB)
    ocular_exam = Column(JSONB)
    fundus = Column(JSONB)

    # 🔥 NEW IMPORTANT FIELDS
    clinical_impression = Column(String)
    advice = Column(String)

    next_visit_date = Column(String)
    next_visit_reason = Column(String)

    created_at = Column(DateTime, default=datetime.utcnow)