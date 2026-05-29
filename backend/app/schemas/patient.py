from pydantic import BaseModel
from typing import Optional

class PatientCreate(BaseModel):
    name: str
    dob: Optional[str]
    gender: Optional[str]
    blood_group: Optional[str]
    marital_status: Optional[str]

    phone: Optional[str]
    email: Optional[str]
    address: Optional[str]

    emergency_contact: Optional[str]
    emergency_person: Optional[str]