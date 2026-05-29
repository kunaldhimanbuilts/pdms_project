from pydantic import BaseModel
from typing import List

class PrescriptionItem(BaseModel):
    medicine_name: str
    type: str
    dosage: str
    duration: str
    instructions: str


class DiagnosisCreate(BaseModel):
    patient_id: int
    doctor_id: int
    appointment_id: int
    diagnosis_text: str
    allergies: str
    prescriptions: List[PrescriptionItem]