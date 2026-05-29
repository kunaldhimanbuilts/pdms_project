from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(Integer, primary_key=True, index=True)

    diagnosis_id = Column(Integer, ForeignKey("diagnoses.id"))

    medicine_name = Column(String)
    type = Column(String)  # tablet / syrup / eye drop

    dosage = Column(String)
    duration = Column(String)
    instructions = Column(String)