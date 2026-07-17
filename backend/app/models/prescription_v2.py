from sqlalchemy import Column, Integer, ForeignKey, String
from app.database import Base

class PrescriptionV2(Base):
    __tablename__ = "prescription_v2"

    id = Column(Integer, primary_key=True, index=True)

    diagnosis_v2_id = Column(Integer, ForeignKey("diagnosis_v2.id"))

    # medicine_id = Column(Integer, ForeignKey("medicines.id"))  # 🔥 shared table
    # Existing medicine from master table
    medicine_id = Column(Integer, ForeignKey("medicines.id"), nullable=True)

    # Medicine name written by doctor
    medicine_name = Column(String)
    dosage = Column(String)
    duration = Column(String)
    instructions = Column(String)
    type = Column(String)