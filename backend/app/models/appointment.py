from sqlalchemy import Column, Integer, String, ForeignKey, Date, Time
from app.database import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)

    patient_id = Column(Integer, ForeignKey("patients.id"))
    doctor_id = Column(Integer, ForeignKey("users.id"))

    date = Column(Date)
    time = Column(Time)

    notes = Column(String)
    status = Column(String, default="pending")  # pending / completed / cancelled