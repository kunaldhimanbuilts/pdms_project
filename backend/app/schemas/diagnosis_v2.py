from pydantic import BaseModel
from typing import List, Dict, Any
from typing import Optional

# 🔥 PRESCRIPTION ITEM
class PrescriptionItemV2(BaseModel):
    medicine_id: int
    dosage: str
    duration: str
    # instructions: str
    instructions: Optional[str] = None
    type: str


# 🔥 MAIN SCHEMA
class DiagnosisV2Create(BaseModel):

    patient_id: int
    appointment_id: int

    # 🔹 ARRAYS
    chief_complaints: List[Dict[str, Any]] = []
    systemic_history: List[Dict[str, Any]] = []

    # 🔹 TEXT
    history_present_illness: str = ''
    surgery_history: str = ''
    allergy_history: str = ''

    # 🔹 COMPLEX JSON
    refraction: Dict[str, Any]
    ocular_exam: Dict[str, Any]
    fundus: Dict[str, Any]

    # 🔹 EXTRA FIELDS
    clinical_impression: str = ''
    advice: str = ''

    next_visit_date: str = ''
    next_visit_reason: str = ''

    # 🔹 PRESCRIPTIONS
    prescriptions: List[PrescriptionItemV2] =[]