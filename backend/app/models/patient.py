from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    patient_code = Column(String, unique=True, index=True)

    name = Column(String)
    # dob = Column(String)
    # gender = Column(String)
    # blood_group = Column(String)
    # marital_status = Column(String)

    # phone = Column(String)
    # email = Column(String)
    # address = Column(String)

    # emergency_contact = Column(String)
    # emergency_person = Column(String)
    dob = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    blood_group = Column(String, nullable=True)
    marital_status = Column(String, nullable=True)

    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    address = Column(String, nullable=True)

    emergency_contact = Column(String, nullable=True)
    emergency_person = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)



