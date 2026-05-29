from pydantic import BaseModel
from datetime import date, time
from typing import Optional

class AppointmentCreate(BaseModel):
    patient_id: int
    doctor_id: int
    date: date
    time: time
    notes: Optional[str] = None