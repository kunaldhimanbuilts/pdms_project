from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.patient import Patient
from app.schemas.patient import PatientCreate
from app.utils.patient_code import generate_patient_code
from app.utils.deps import require_role
from app.utils.deps import require_roles
from sqlalchemy import or_
router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ✅ Create Patient
@router.post("/")
def create_patient(data: PatientCreate, db: Session = Depends(get_db), user=Depends(require_role("compounder"))):

    last_patient = db.query(Patient).order_by(Patient.id.desc()).first()
    next_id = 1 if not last_patient else last_patient.id + 1

    patient_code = generate_patient_code(next_id)

    new_patient = Patient(
        patient_code=patient_code,
        **data.dict()
    )

    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    return new_patient


# ✅ Get All Patients
@router.get("/")
def get_patients(db: Session = Depends(get_db), user=Depends(require_role("admin"))):
    return db.query(Patient).all()



# ✅ Search by Patient Code (IMPORTANT)
@router.get("/search/{code}")
def search_patient(code: str, db: Session = Depends(get_db), user=Depends(require_roles(["doctor", "compounder", "admin"]))):   
    patient = db.query(Patient).filter(Patient.patient_code == code).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    return patient

@router.get("/search-list/{query}")
def search_patient_list(
    query: str,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["doctor", "compounder", "admin"]))
):

    patients = db.query(Patient).filter(
        or_(
            Patient.patient_code.ilike(f"%{query}%"),
            Patient.name.ilike(f"%{query}%"),
            Patient.phone.ilike(f"%{query}%"),
            Patient.address.ilike(f"%{query}%")
        )
    ).order_by(Patient.name).limit(20).all()

    return patients
# ✅ Get Single Patient
@router.get("/{patient_id}")
def get_patient(patient_id: int, db: Session = Depends(get_db),user=Depends(require_roles(["doctor", "compounder", "admin"]))):
    
    patient = db.query(Patient).filter(Patient.id == patient_id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    return patient

# Get full history of patient
@router.get("/patient/{patient_id}")
def patient_history(patient_id: int, db: Session = Depends(get_db), user=Depends(require_role("admin"))):

    diagnoses = db.query(Diagnosis).filter(
        Diagnosis.patient_id == patient_id
    ).all()

    result = []

    for diag in diagnoses:
        prescriptions = db.query(Prescription).filter(
            Prescription.diagnosis_id == diag.id
        ).all()

        result.append({
            "diagnosis": diag,
            "prescriptions": prescriptions
        })

    return result